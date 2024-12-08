import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { TempContentSchedule } from './temp-content/temp-content.schedule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(),
  });

  const tempContentSchedule = app.get(TempContentSchedule);

  await tempContentSchedule.savePerformListCronJob();

  await app.listen(3000);
}
bootstrap();
