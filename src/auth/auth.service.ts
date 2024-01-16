import { Model } from 'mongoose';
import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { SignInDto, SignUpDto } from './dto/auth.dto';
import { User, UserDocument } from './schema/auth.schema';
import { IAuthUser } from './interfaces/auth.interface';
import { parseDBError } from 'src/helpers/main';
import {
  ExceptionFilter,
  ServiceException,
} from 'src/helpers/exceptions/service.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserSchema: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignUpDto): Promise<IAuthUser> {
    try {
      const users = await this.UserSchema.find({ email: data.email });
      if (users.length) {
        throw new ServiceException({
          message: 'email already exist',
          status: 400,
        });
      }

      const user = new this.UserSchema({ ...data });
      const password = await bcrypt.hash(user.password, 10);
      user.password = password;

      return this.signUser(user);
    } catch (e) {
      console.log(e);
      throw new ServiceException(e);
    }
  }

  async signin(data: SignInDto): Promise<IAuthUser> {
    try {
      const user = await this.UserSchema.findOne({ email: data.email });
      if (!user) {
        throw new ServiceException({ status: 400, message: 'User not found' });
      }

      if (await bcrypt.compare(data.password, user.password)) {
        return this.signUser(user);
      }
      throw new ServiceException({
        message: 'incorrect password',
        status: 500,
      });
      
    } catch (e) {
      console.log(e);
      throw new ServiceException(e);
    }
  }

  async signUser(user: UserDocument): Promise<IAuthUser> {
    const token: string = await this.jwtService.signAsync(
      {
        email: user.email,
        id: user._id,
      },
      { expiresIn: '45hr' },
      // { expiresIn: '15min' },
    );

    const authUser: IAuthUser = {
      token,
      email: user.email,
      id: user._id,
      fullname: user.fullname,
    };
    await user.save();
    return authUser;
  }
}
