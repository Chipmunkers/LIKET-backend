import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KopisPerformService } from './kopis-perform/kopis-perform.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kopisPerformService = app.get(KopisPerformService);

  const data = await kopisPerformService.getPerformAll({
    cpage: 1,
    rows: 100,
    afterdate: '20241204',
  });

  await app.listen(3000);
}
bootstrap();
