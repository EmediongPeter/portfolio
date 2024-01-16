import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAuthDto {}

export class SignUpDto {
  // @ApiProperty({ description: '', required: true })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  // @ApiProperty({ description: '', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @ApiProperty({ description: '', required: true })
  @IsNotEmpty()
  @IsPhoneNumber('NG')
  phone: string;

  // @ApiProperty({ description: '', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignInDto {
  // @ApiProperty({ description: '', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @ApiProperty({ description: '', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
