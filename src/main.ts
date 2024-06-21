import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/exceptions/exception.filter';
import { APIInterceptor } from './common/interceptors/api.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 9502;

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // DTO에 정의되지 않은 프로퍼티들을 자동으로 제거
      forbidNonWhitelisted: false, // 정의되지 않은 프로퍼티가 존재할 경우 에러 발생
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new APIInterceptor());
  await app.listen(PORT);
}
bootstrap();
