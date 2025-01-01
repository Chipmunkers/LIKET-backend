import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { TourApiProvider } from 'apps/batch-server/src/content-cron/external-apis/tour/provider/tour-api.provider';
import * as fs from 'fs';
import { AxiosError } from 'axios';
import { TourApiService } from 'apps/batch-server/src/content-cron/external-apis/tour/tour-api.service';

async function bootstrap() {
  const logger = new ConsoleLogger();
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  await app.listen(3000);

  const result = await app.get(TourApiService).getSummaryAll();

  const dataList: any[] = [];

  for (const summaryFestival of result) {
    try {
      const festival = await app.get(TourApiService).getDetail(summaryFestival);

      dataList.push(festival);
    } catch (err) {
      console.log(summaryFestival.contentid);
      console.log(err);
    }
  }

  fs.writeFileSync(
    'test-data/detail-festival-list.json',
    JSON.stringify(dataList),
  );

  // TODO: 배포 할 때 마다 실행하도록. 그러나 낭비라고 생각되면 삭제해야함.
  //await app.get(ContentCronService).saveContentFromExternalAPI();
}
bootstrap();
