import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../helpers/guards/auth.guard';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { IAuthUser } from './interfaces/auth.interface';
import { GoogleAuthStrategy } from './strategy/google.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthStrategy: GoogleAuthStrategy,
  ) {}


  @Post('register')
  signUp(@Body() data: SignUpDto): Promise<IAuthUser> {
    return this.authService.signup(data);
  }

  @Post('login')
  signIn(@Body() data: SignInDto): Promise<IAuthUser> {
    return this.authService.signin(data);
  }

  @Post('google')
  googleAuth(@Body('token') token) {
    console.log(this.googleAuthStrategy.validate(token))
    return;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
