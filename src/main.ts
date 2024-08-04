import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/exceptions/exception.filter';
import { APIInterceptor } from './common/interceptors/api.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { winstonLogger } from './common/utils/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  app.useLogger(winstonLogger);
  const PORT = process.env.PORT || 9502;

  const corsOptions: CorsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Origin,Content-Type,Authorization,Accept',
    credentials: true,
    maxAge: 81600,
  };
  app.enableCors(corsOptions);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'Authorization',
    )
    .addCookieAuth('refresh')
    .setTitle('Travel Tales API')
    .setDescription('The Travel Tales API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
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
