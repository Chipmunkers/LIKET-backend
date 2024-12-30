import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { ContentCronService } from 'apps/batch-server/src/content-cron/content-cron.service';
import { TourApiProvider } from 'apps/batch-server/src/content-cron/external-apis/tour/provider/tour-api.provider';
import * as fs from 'fs';
import { AxiosError } from 'axios';

async function bootstrap() {
  const logger = new ConsoleLogger();
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  await app.listen(3000);

  try {
    const result = await app.get(TourApiProvider).getSummaryFestivalAll();

    console.log(result);

    fs.writeFileSync('test-data/festival-result.json', JSON.stringify(result));

    logger.log('complete', 'FESTIVAL');
  } catch (err) {
    console.log((err as AxiosError).response);
  }

  // TODO: 배포 할 때 마다 실행하도록. 그러나 낭비라고 생각되면 삭제해야함.
  //await app.get(ContentCronService).saveContentFromExternalAPI();
}
bootstrap();
