import { NestFactory } from '@nestjs/core';
import { MobileBatchModule } from './mobile-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(MobileBatchModule);
  await app.listen(3000);
}
bootstrap();
