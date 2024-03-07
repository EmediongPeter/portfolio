import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  RegisterUserDto,
  TokenCredentialstDto,
} from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { LoginResponse } from './types/login-response.type';
import { UserWithoutPassword } from './types/user-without-password.type';
import { RefreshTokenGuard } from 'src/common/guards';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { JwtPayload } from './strategy';
import { IAuthUser } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiTags('Register users')
  @ApiOperation({ description: 'User registration on the platform' })
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body() registerUserDto: RegisterUserDto,
    @Req() request: Request,
  ): Promise<IAuthUser> {
    const browserInfo =
      `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(
        / undefined/g,
        '',
      );
    return this.authService.register(registerUserDto, browserInfo);
  }

  @Public()
  @Post('login')
  login(
    @Body() { email, password }: LoginUserDto,
    @Req() request: Request,
  ): Promise<LoginResponse> {
    return this.authService.login(email, password, request.ip);
  }

  @Public()
  @Get('log')
  getINfo(@Req() request: Request) {
    return {
      ip: request.ip,
      agent: request.headers['user-agent'],
      lang: request.headers['accept-language'],
    };
  }

  @Get('logout')
  logout(
    @GetCurrentUser('sub') userId: string,
    @Req() req: Request,
  ): Promise<void> {
    this.authService.logout(userId);
    req.res.setHeader('Authorization', null);
    return;
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiTags('Refresh authentication token')
  @ApiOperation({ description: 'Logout' })
  async refreshToken(
    @GetCurrentUser() user: JwtPayload,
  ): Promise<LoginResponse> {
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
  }
}
