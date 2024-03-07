import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRepository } from 'src/repositories/user.repository';
export class AuthToken {
  private jwtService: JwtService;
  private userRepo: UserRepository;
  public static accessToken() {}

  public async handleRefreshToken(request: Request) {
    const cookies = request.cookies;
    if (!cookies?.jwt)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const refreshToken = cookies.jwt;

    const foundUser = await this.userRepo.findOne({ refreshToken });
    if (!foundUser) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    // evaluate jwt
      const verifyRefreshToken = await this.jwtService.verify(refreshToken)
      
    
        
  }
}
