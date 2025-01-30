import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { CulturePortalProvider } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/provider/culture-portal.provider';
import * as fs from 'fs';
import { KakaoAddressService } from 'libs/modules/kakao-address/kakao-address.service';

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

  await app.listen(3000);

  // const result = await app.get(CulturePortalProvider).getPerformanceDisplay();

  // fs.writeFileSync(
  //   './test-data/culture-portal/get-list.json',
  //   JSON.stringify(result),
  // );

  // console.log(result);

  const result2 = await app
    .get(CulturePortalProvider)
    .getPerformanceDisplayBySeq('306530');

  // await app
  //   .get(CulturePortalProvider)
  //   .getFacilityAll('대전시립박물관 여민관');

  console.dir(result2, { depth: null });
}
bootstrap();
