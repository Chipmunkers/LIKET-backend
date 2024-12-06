import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { S3Service } from 'libs/modules';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(),
  });

  const s3Service = app.get(S3Service);

  await s3Service.uploadFileToS3ByUrl(
    'http://www.kopis.or.kr/upload/pfmPoster/PF_PF255391_241206_145608.jpg',
    {
      filename: '00001.png',
      path: 'culture-content',
    },
  );

  await app.listen(3000);
}
bootstrap();
