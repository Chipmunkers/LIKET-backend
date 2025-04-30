import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { InstagramService } from 'libs/modules/instagram/instagram.service';
import * as uuid from 'uuid';
import { OpenAIService, S3Service } from 'libs/modules';
import * as fs from 'fs';
import { KakaoAddressService } from 'libs/modules/kakao-address/kakao-address.service';

async function bootstrap() {
  const logger = new ConsoleLogger();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const result = await app
    .get(InstagramService)
    .getInstagramFeedData('DISZqmtSFRI');

  const s3Service = app.get(S3Service);
  const imgList = await Promise.all(
    result.images.map(
      async (img) =>
        await s3Service.uploadFileToS3ByUrl(img, {
          filename: uuid.v4(),
          path: 'instagram',
        }),
    ),
  );

  const ai_result = await app.get(OpenAIService).extractContentInfo(
    result,
    imgList.map((img) => img.url),
  );

  const styleAndAge = await app.get(OpenAIService).extractStyleAndAge(
    { ...result, ...ai_result },
    imgList.map((img) => img.url),
  );

  const address = ai_result.address
    ? await (async () => {
        try {
          return await app
            .get(KakaoAddressService)
            .searchAddress(ai_result.address);
        } catch (err) {
          return {};
        }
      })()
    : {};

  fs.writeFileSync(
    'instagram-result.json',
    JSON.stringify({
      ...ai_result,
      images: imgList.map((img) => img.url),
      ...styleAndAge,
      ...address,
    }),
  );

  app.enableCors({
    origin: ['https://admin.liket.site', 'http://localhost:3000'],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
