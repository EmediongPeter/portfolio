import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  IsStrongPassword,
  IsArray,
  IsLowercase,
  IsJWT,
} from 'class-validator';
import { userTypes } from 'src/schemas/User';

export class RegisterUserDto {
  @ApiProperty({ description: 'fullname of user', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'valid email of user', required: true })
  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  email: string;

  @ApiProperty({
    description:
      'the password should be strong and of minimum length of 8 characters',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'only user or admin is to be passed',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsIn([userTypes.USER, userTypes.ADMIN, userTypes.SUPERADMIN])
  role: string;

  @ApiProperty({
    description: 'Only for admins upon registration',
    required: false,
  })
  @IsOptional()
  @IsString()
  secretToken: string;

  @IsOptional()
  @IsArray()
  refreshToken: string[];

  isVerified: boolean;
}

export class LoginUserDto {
  @ApiProperty({ description: 'valid email of user', required: true })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description:
      'the password should be strong and of minimum length of 8 characters',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class TokenCredentialstDto {
  @ApiProperty({
    description: 'Input user refresh token for validation',
    required: true,
  })
  @IsJWT()
  refreshToken: string;
}