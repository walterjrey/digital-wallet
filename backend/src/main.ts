import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './app.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
