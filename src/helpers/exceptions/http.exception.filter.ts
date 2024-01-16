import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response } from 'express';
import * as fs from 'fs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    const getFiles = (files: Express.Multer.File[] | unknown | undefined) => {
      if (!files) return [];
      if (isArray(files)) return files;
      return Object.values(files);
    };

    const filePaths = getFiles(request.files);

    for (const file of filePaths) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message
    });
  }
}
