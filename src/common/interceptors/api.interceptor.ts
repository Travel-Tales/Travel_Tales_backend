import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { CoreOutput } from '../dtos/core.output';

@Injectable()
export class APIInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> | Observable<any> {
    const request = context.switchToHttp().getRequest();
    const path = request.originalUrl;
    const logger = new Logger();

    logger.log(`${path}`);

    return next.handle().pipe(
      map(
        (data): CoreOutput<any> => ({
          message: 'Request successful',
          success: true,
          data: data,
        }),
      ),
    );
  }
}
