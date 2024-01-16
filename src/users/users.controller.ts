import {
  Body,
  Controller,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  ParseFilePipeBuilder,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { UsersService } from './users.service';
import { AuthGuard } from 'src/helpers/guards/auth.guard';
import { UpdateProfileDto } from './dto/update-user.dto';
import { IUserProfile } from './interfaces/users.interface';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Patch('')
  updateProfile(@Request() req, @Body() data: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, data);
  }

  @UseGuards(AuthGuard)
  @Patch('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  updatePicture(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Array<Express.Multer.File>,
  ) {
    return this.usersService.updatePicture(req.user.id, file);
  }
}
