import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum userTypes {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: [userTypes.USER, userTypes.ADMIN, userTypes.SUPERADMIN],
  })
  role: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String, default: null })
  otp: string;

  @Prop({ type: Date, default: null })
  otpExpiryTime: Date;

  @Prop({ type: String, default: null })
  forgotPasswordToken: string;
  
  @Prop({ type: Date, default: null })
  forgotPasswordTokenExpiry: Date;

  @Prop(Array<{ type: String; default: [] }>)
  refreshToken: Array<string>;

  // @Prop({ type: String, default: '' })
  // refreshToken: string;

  @Prop({ type: Number, default: 0 })
  attempt: number;

  @Prop({ type: Date })
  last_attempt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
