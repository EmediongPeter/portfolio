import { Module } from '@nestjs/common';
import { TodoService } from './todos.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TodoController } from './todos.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './entities/todos.schema';
import { JwtModule } from '@nestjs/jwt';
import { Category, CategorySchema } from './entities/category.schema';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [TodoController],
  providers: [TodoService, CloudinaryService],
})
export class TodosModule {}
