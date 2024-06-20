import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ServiceException } from './service.exception';
import { Response } from 'express';

@Catch(ServiceException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.errorCode.status;

    response.status(status).json({
      message: exception.message,
      statusCode: status,
    });
  }
}
