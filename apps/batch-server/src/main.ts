import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KopisPerformService } from './kopis-perform/kopis-perform.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kopisPerformService = app.get(KopisPerformService);

  await kopisPerformService.getPerformAll({
    stdate: '20231212',
    eddate: '20251231',
    cpage: 1,
    rows: 100,
  });

  await app.listen(3000);
}
bootstrap();
