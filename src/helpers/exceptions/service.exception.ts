import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionFilter extends HttpException {
  constructor(error) {
    super(error, HttpStatus.FORBIDDEN);
  }
}
export class ServiceException extends HttpException {
  constructor(error, status = error.status || 500) {
    super((error = error.message), status);
    this.name = 'Service Exception';      
  }
}
