import { Types } from 'mongoose';
export type IAuthUser = {
  accessToken?: string;
  refreshToken?: string;
  email: string;
  name?: string;
  id: Types.ObjectId;
  role?: string;
  isVerified?: boolean;
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}