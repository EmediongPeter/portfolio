import { JwtSignOptions } from '@nestjs/jwt';

export function JwtConfig() {
  return {
    accessJwtConfig, 
    refreshJwtConfig
  }
}
/** Configurations for the access jsonwebtoken used for authentication */
export const accessJwtConfig: JwtSignOptions = {
  secret: process.env.ACCESS_TOKEN_SECRET!,
  expiresIn: process.env.ACCESS_TOKEN_EXPIRATION!,
};

/** Configurations for the refresh jsonwebtoken used for authentication */
export const refreshJwtConfig: JwtSignOptions = {
  secret: process.env.REFRESH_TOKEN_SECRET!,
  expiresIn: process.env.REFRESH_TOKEN_EXPIRATION!,
};
