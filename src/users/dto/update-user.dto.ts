import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullname?: string;

  @IsPhoneNumber('NG')
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsString()
  @IsOptional()
  cloudId?: string;
}
