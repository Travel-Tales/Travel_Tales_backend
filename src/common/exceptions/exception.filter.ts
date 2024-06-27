import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { ServiceException } from './service.exception';
import { Response } from 'express';

@Catch(ServiceException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: ServiceException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.errorCode.status;
    const { method, url, body, headers } = request;
    const ip = request.headers['x-forwarded-for'];
    const userAgent = request['user-agent'];
    const user = request['user'];
    const userId = user ? user.id : 0;

    this.logger.log(
      `USER-${userId} ${method} ${url} ${status} ${ip} ${userAgent} ${JSON.stringify(headers)} ${JSON.stringify(body)}`,
    );

    response.status(status).json({
      message: exception.message,
      statusCode: status,
    });
  }
}
