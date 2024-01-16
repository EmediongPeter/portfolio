import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isMobilePhone } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export type RoleDocument = HydratedDocument<Role>;

export enum RoleCode {
  LEARNER = 'LEARNER',
  WRITER = 'WRITER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class Role {
  @Prop({ type: String, required: true, enum: Object.values(RoleCode) })
  code: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;
}

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ type: String })
  fullname: string;

  @Prop({
    type: String,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    validate: [
      {
        validator: isMobilePhone,
        message: (val) => 'please enter a valid phone Number',
      },
    ],
  })
  phone: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  occupation: string;

  @Prop({ type: Date })
  dob: Date;

  @Prop({ type: String })
  gender: string;

  @Prop({ type: String, min: 50 })
  bio: string;

  @Prop({ type: String })
  cloudId: string;

  // @Prop({
  //   type: Types.ObjectId,
  //   ref: 'Role',
  //   required: true,
  //   select: false,
  //   unique: true,
  // })
  // type: Role;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const RoleSchema = SchemaFactory.createForClass(Role);
