import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KopisPerformService } from './kopis-perform/kopis-perform.service';
import { ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(),
  });

  const kopisPerformService = app.get(KopisPerformService);

  const data = await kopisPerformService.getDetailPerformAllUpdatedAfterToday();

  fs.writeFileSync('./data.json', JSON.stringify(data));

  await app.listen(3000);
}
bootstrap();
