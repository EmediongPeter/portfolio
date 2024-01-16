import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: String, unique: true, required: [true, 'A Name is required'] })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
