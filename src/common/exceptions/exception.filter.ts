import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ServiceException } from './service.exception';
import { Response } from 'express';

@Catch(ServiceException, BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(
    exception: ServiceException | BadRequestException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof ServiceException
        ? exception.errorCode.status
        : exception.getStatus();
    const { method, url, body, headers } = request;
    const ip = request.headers['x-forwarded-for'];
    const userAgent = request['user-agent'];
    const user = request['user'];
    const userId = user ? user.id : 0;
    let message: string;
    if (exception instanceof ServiceException) {
      message = exception.message;
    } else {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        message = (response as any).message;
      } else {
        message = 'Unexpected error';
      }
    }

    this.logger.error(
      `USER-${userId} ${method} ${url} ${status} ${ip} ${userAgent} ${JSON.stringify(headers)} ${JSON.stringify(body)}`,
      exception.stack,
    );

    response.status(status).json({
      message: message,
      error: exception.message,
      statusCode: status,
    });
  }
}
