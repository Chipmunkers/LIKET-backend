import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { DiscordService } from 'libs/modules/discord/discord.service';

async function bootstrap() {
  const logger = new ConsoleLogger();
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(3000);

  const discordService = app.get(DiscordService);

  await discordService.createErrorLog('batch-server', 'title', 'test');
}
bootstrap();
