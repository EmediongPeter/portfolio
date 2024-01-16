import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Category } from './category.schema';
import { PaginatePlugin } from '../../../../helpers/plugin/mongo/pagination.plugin';
// import { Currency } from '../../currency/entities/currency.entity';

export type TodoDocument = HydratedDocument<Todo>;

@Schema({ timestamps: true })
export class SubTodo {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  desc: string;

  @Prop({ type: Number, default: 0 })
  priority: number;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  emoji: string;

  @Prop({ type: Date, default: false })
  reminder: Date;

  @Prop({ type: Date, default: false })
  due_date: Date;

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;
}

@Schema({ timestamps: true })
export class Todo {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
  })
  category: Category;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  desc: string;

  @Prop({ type: Number, default: 0 })
  priority: number;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  emoji: string;

  @Prop([{
    type: Types.ObjectId,
    ref: 'SubTodo',
  }])
  subTodo: Array<SubTodo>;

  @Prop({ type: Boolean, default: false })
  setReminder: boolean;

  @Prop({ type: Date, default: false })
  due_date: Date;

  @Prop({ type: [String] })
  media: string[];

  @Prop({ type: [String] })
  cloudId: string[];

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
export const SubTodoSchema = SchemaFactory.createForClass(SubTodo);
TodoSchema.plugin(PaginatePlugin);
