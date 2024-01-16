import { Types } from 'mongoose';
export interface IAuthUser {
  email: string;
  fullname?: string;
  id: Types.ObjectId;
  phone?: string;
  token: string;
}
