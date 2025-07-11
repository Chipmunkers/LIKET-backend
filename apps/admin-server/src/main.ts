import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GET_MODE, MODE } from 'libs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  if (GET_MODE() === MODE.PRODUCT) {
    app.enableCors({
      origin: ['http://admin.liket.site', 'https://admin.liket.site'],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: [
        'https://admin-dev.liket.site',
        'http://admin-dev.liket.site',
        'http://localhost:3000',
      ],
      credentials: true,
    });

    const swaggerConfig = new DocumentBuilder()
      .setTitle('LIKET Admin API document')
      .setDescription(
        `
      LIKET 관리자페이지 전용 API 명세서입니다. 모든 서버 에러는 500 상태코드로 통일해서 전달됩니다.

      이외의 모든 상태코드는 각 API 마다 표시될 것이며 400 상태코드를 제외한 모든 예외 응답코드는 \`{ status: number, message: string }\` 형태의 바디를 가집니다.

      단, 성공을 제외한 모든 예외 상태코드의 Response Body는 개발 편의를 위한 것이므로 코드에서는 사용하지 않는 것을 권장드립니다.
      `,
      )
      .setVersion('0.0.3')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
