import { HttpStatus, Injectable, ParseFilePipeBuilder } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './entities/todos.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ServiceException } from 'src/helpers/exceptions/service.exception';
import { CreateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private TodoSchema: Model<TodoDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async addTodo(
    data: CreateTodoDto,
    files: Array<Express.Multer.File>,
  ): Promise<Todo> {
    try {
      if (files.length) {
        const uploads = await this.cloudinaryService
          .uploadFile(files)
          .catch((e) => {
            throw new ServiceException({
              message: 'Unable to upload file to cloud',
              status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
            });
          });

        data.media = uploads.secure_url;
        data.cloudId = uploads.public_id;
      }

      const todo = await new this.TodoSchema({ ...data });
      return todo;
    } catch (e) {
      console.log(e);
      throw new ServiceException(e);
    }
  }

  async getAllTodos(data) {
    try {
      const todos = await this.TodoSchema.find({ data });
      return todos;
    } catch (e) {
      console.log(e);
      throw new ServiceException(e);
    }
  }
}
