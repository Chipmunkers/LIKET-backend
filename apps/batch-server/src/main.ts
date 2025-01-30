import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { CulturePortalProvider } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/provider/culture-portal.provider';
import * as fs from 'fs';
import { KakaoAddressService } from 'libs/modules/kakao-address/kakao-address.service';
import { CulturePortalDisplay } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/culture-portal-display';

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

  app.enableCors({
    origin: ['https://admin.liket.site', 'http://localhost:3000'],
    credentials: true,
  });

  //await app.listen(3000);

  const result = await app
    .get(CulturePortalProvider)
    .getPerformanceDisplayAll('20100130', '20250630');

  const result2: CulturePortalDisplay[] = [];
  const failList: any[] = [];

  let i = 1;
  for (const summaryDisplay of result) {
    console.log(`${i} / ${result.length} | seq = ${summaryDisplay.seq}`);
    i++;
    try {
      const data = await app
        .get(CulturePortalProvider)
        .getPerformanceDisplayBySeq(summaryDisplay.seq);

      if (data) {
        result2.push(data);

        continue;
      }

      console.log(`해당 데이터는 존재하지 않음: ${summaryDisplay.seq}`);
    } catch (error) {
      failList.push(error);
    }
  }

  fs.writeFileSync(
    './test-data/culture-portal/detail-display-list.json',
    JSON.stringify(result2),
  );

  fs.writeFileSync(
    './test-data/culture-portal/detail-display-fail-list.json',
    JSON.stringify(failList),
  );

  // console.log(result);

  // const result2 = await app
  //   .get(CulturePortalProvider)
  //   .getPerformanceDisplayBySeq('306530');

  //await app.get(CulturePortalProvider).getFacilityAll('대전시립박물관 여민관');

  //console.dir(result2, { depth: null });
}
bootstrap();
