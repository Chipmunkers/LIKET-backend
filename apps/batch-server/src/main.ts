import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { KopisPerformApiService } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(),
  });

  const kopisPerformApiService = app.get(KopisPerformApiService);

  const result = await kopisPerformApiService.getSummaryAll();

  console.dir(result, { depth: null });
  console.log(result.length);

  await app.listen(3000);
}
bootstrap();
