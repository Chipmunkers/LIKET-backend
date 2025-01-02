import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { ContentCronService } from 'apps/batch-server/src/content-cron/content-cron.service';

async function bootstrap() {
  const logger = new ConsoleLogger();
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  await app.listen(3000);

  // TODO: 배포 할 때 마다 실행하도록. 그러나 낭비라고 생각되면 삭제해야함.
  await app.get(ContentCronService).saveContentFromExternalAPI();
}
bootstrap();
