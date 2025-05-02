import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new ConsoleLogger();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin: ['https://admin.liket.site', 'http://localhost:3000'],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
