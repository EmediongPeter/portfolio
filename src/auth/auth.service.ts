import {
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';

import { LoginUserDto, RegisterUserDto } from './dto/create-auth.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { compareData, generateHashData } from 'src/utilities/data-manager';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/User';
import { IAuthUser, Tokens } from './types';
import { InvalidEmailOrPasswordException } from 'src/common/exceptions/auth/invalid-email-or-password';
import { LoginResponse } from './types/login-response.type';
import { InvalidRefreshTokenException } from 'src/common/exceptions/auth/invalid-refresh-token.exception';
import { getTokenExpirationDate } from 'src/utilities/getTokenExpiration';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenDocument } from 'src/schemas/RefreshToken';

/** Responsible for authenticating the user */
@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenSchema: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
  ) {}

  /** Creates a new user and assign tokens */
  async register(
    registerUserDto: RegisterUserDto,
    browserInfo?: string,
  ): Promise<IAuthUser> {
    const { email, password } = registerUserDto;
    let user = await this.userRepo.findOne({ email });

    if (user) {
      throw new ForbiddenException('User already exists');
    }

    const hashedPassword = await generateHashData(password);
    registerUserDto.password = hashedPassword;
    registerUserDto.refreshToken = [];

    user = await this.userRepo.create({ ...registerUserDto });

    const payload = { sub: user.id, role: user.role };

    const accessToken = await this.generateAccessToken(payload);

    const refreshToken = await this.createRefreshToken(payload);

    const tokens = { accessToken, refreshToken };

    delete user.password;

    return this.authResponse(user, tokens);
  }

  /** Validates if the inputted email exists and
   * compares if the hashed password matches the inputted one.
   *
   * If so, returns the access and refresh JWTs
   */
  async login(
    email: string,
    password: string,
    browserInfo?: string,
  ): Promise<LoginResponse> {
    const user = await this.validateUser(email, password);

    const payload = { sub: user.id, role: user.role };

    const accessToken = await this.generateAccessToken(payload);

    const refreshToken = await this.createRefreshToken(payload);

    const tokens = { accessToken, refreshToken };

    return tokens;
  }

  /** Refreshes and rotates user's access and refresh tokens */
  async refreshTokens(
    id: string,
    refreshToken: string,
    browserInfo?: string,
  ): Promise<LoginResponse> {
    const user = await this.userRepo.findById(id);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    await this.validateRefreshToken(refreshToken);

    const payload = { sub: user.id, role: user.role };

    const accessToken = await this.generateAccessToken(payload);

    const newRefreshToken = await this.createRefreshToken(payload);

    const tokens = { accessToken, refreshToken: newRefreshToken };

    return tokens;
  }

  /** Deletes the refreshToken from the database*/
  async logout(id: string): Promise<void> {
    const user = await this.userRepo.findOne(id);
    return;
  }

  /** Validates if the inputted email exists and
   * compares if the hashed password matches the inputted one.
   *
   * If not, throws an error
   */
  private async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.userRepo.findOne({ email });

    if (user) {
      const isPasswordValid = await compareData(password, user.password);

      if (isPasswordValid) {
        user.password = undefined;
        return user;
      }
    }

    throw new InvalidEmailOrPasswordException();
  }

  /** Generates user's access token */
  private async generateAccessToken(payload: {
    sub: string;
    role: string;
  }): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET!,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION!,
    });

    return accessToken;
  }

  /** Creates the refresh token and saves it in the database */
  private async createRefreshToken(
    payload: {
      sub: string;
      role?: string;
    },

    browserInfo?: string,
  ): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET!,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION!,
    });

    await this.saveRefreshToken(payload.sub, refreshToken, browserInfo);

    return refreshToken;
  }

  /** Saves and updates the new refresh token hashed in the database */
  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
    browserInfo: string,
  ): Promise<void> {
    const expiresAt = getTokenExpirationDate();

    const storedRefreshToken = await this.refreshTokenSchema.findOne({
      userId,

      browserInfo,
    });

    if (storedRefreshToken) {
      await this.refreshTokenSchema.deleteMany({
        userId,
        browserInfo,
      });
    }

    await this.refreshTokenSchema.create({
      userId,
      browserInfo,
      expiresAt,
    });
  }

  /** Checks if the refresh token is valid */
  private async validateRefreshToken(refreshToken: string): Promise<any> {
    const refreshTokenContent = this.jwtService.decode(refreshToken);

    const userTokens = await this.refreshTokenSchema.find({
      userId: refreshTokenContent.sub,
      refreshToken,
    });

    const isRefreshTokenValid = userTokens.length > 0;

    if (!isRefreshTokenValid) {
      await this.removeRefreshTokenFamilyIfCompromised(refreshTokenContent.sub);
      throw new InvalidRefreshTokenException();
    }

    return refreshTokenContent;
  }

  /** Removes a compromised refresh token family from the database */
  private async removeRefreshTokenFamilyIfCompromised(
    userId: string,
  ): Promise<void> {
    const hackedUserTokens = await this.refreshTokenSchema.find({
      userId,
    });

    if (hackedUserTokens.length > 0) {
      await this.refreshTokenSchema.deleteMany({
        userId,
      });
    }
  }

  /** Removes the old token from the database and creates a new one */
  private async rotateRefreshToken(
    refreshToken: string,
    refreshTokenContent,
    // refreshTokenContent: RefreshTokenPayload,
    browserInfo?: string,
  ): Promise<string> {
    await this.refreshTokenSchema.deleteMany({ refreshToken });

    const newRefreshToken = await this.createRefreshToken(
      { sub: refreshTokenContent.sub },
      browserInfo,
    );

    return newRefreshToken;
  }

  private authResponse(user: UserDocument, token: Tokens): IAuthUser {
    const authUser: IAuthUser = {
      email: user.email,
      name: user.name,
      id: user._id,
      role: user.role,
      isVerified: user.isVerified,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
    return authUser;
  }
}
