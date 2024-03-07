import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './User';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Types.ObjectId, ref: 'User', unique: true })
  userId: User;

  @Prop({ type: String, default: '' })
  browserInfo: string;

  @Prop({ type: Date })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
