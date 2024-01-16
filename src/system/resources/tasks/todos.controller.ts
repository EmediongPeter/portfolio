import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { TodoService } from './todos.service';
import { AuthGuard } from 'src/helpers/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateTodoDto } from './dto/todo.dto';
import { Todo } from './entities/todos.schema';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  addTodo(
    @Body() data: CreateTodoDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Todo> {
    console.log(data)
    return this.todoService.addTodo(data, files);
  }
}
