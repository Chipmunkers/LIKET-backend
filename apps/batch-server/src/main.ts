import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { KopisPerformApiService } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.service';
import * as fs from 'fs';

async function bootstrap() {
  const logger = new ConsoleLogger();
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // TODO: 삭제해야함
  // const context = 'Content-From-KOPIS';

  // const kopisPerformApiService = app.get(KopisPerformApiService);

  // const summaryPerformList = await kopisPerformApiService.getSummaryAll();

  // const result = await Promise.all(
  //   summaryPerformList.map(async (summaryPerform, i) => {
  //     logger.debug(
  //       `GET Detail Perform ${Number(i) + 1}/${summaryPerformList.length}`,
  //       context,
  //     );
  //     const detailPerform = await kopisPerformApiService.getDetail(
  //       summaryPerform,
  //     );

  //     logger.debug(
  //       `Transform Perform ${Number(i) + 1}/${summaryPerformList.length}`,
  //       context,
  //     );
  //     return await kopisPerformApiService.getAdapter().transform(detailPerform);
  //   }),
  // );

  // console.dir(result, { depth: null });
  // fs.writeFileSync('test-data/result.json', JSON.stringify(result));

  await app.listen(3000);
}
bootstrap();
