import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ServiceException } from './service.exception';
import { Request, Response } from 'express';

@Catch(ServiceException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.errorCode.status;

    response.status(status).json({
      message: exception.message,
      path: request.url,
    });
  }
}
