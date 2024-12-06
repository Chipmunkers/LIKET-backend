import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { TempCultureContentService } from './temp-content/temp-culture-content.service';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(),
  });

  const tempContentService = app.get(TempCultureContentService);

  const data =
    await tempContentService.getDetailPerformAllUpdatedAfterYesterday();

  fs.writeFileSync('./data.json', JSON.stringify(data));

  await app.listen(3000);
}
bootstrap();
