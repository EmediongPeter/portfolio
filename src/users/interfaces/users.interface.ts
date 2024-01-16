import { Types } from 'mongoose';
export interface IUserProfile {
  email?: string;
  fullname?: string;
  id: Types.ObjectId;
  phone?: string;
  avatar?: string;
  location?: string;
  role?: string;
  bio?: string;
  occupation?: string;
}