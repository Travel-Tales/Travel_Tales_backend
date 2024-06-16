import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 9502;

  app.setGlobalPrefix('api');
  await app.listen(PORT);
}
bootstrap();
