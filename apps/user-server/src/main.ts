import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  if (process.env.MODE === 'product') {
    app.enableCors({
      origin: ['https://liket.site', 'http://liket.site'],
      credentials: true,
    });
    app.use(helmet());
  } else {
    app.enableCors({
      origin: [
        'https://dev.liket.site',
        'http://dev.liket.site',
        'http://localhost:3000',
      ],
      credentials: true,
    });
  }

  app.use(cookieParser(process.env.COOKIE_SECRET));

  // TODO: 배포 상황에서 삭제 필요
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Liket Mobile Backend API')
    .setDescription(
      `
      LIKET Mobile 전용 API 명세서입니다. 모든 서버 에러는 500 상태코드로 통일해서 전달됩니다.

      이외의 모든 상태코드는 각 API 마다 표시될 것이며 400 상태코드를 제외한 모든 예외 응답코드는 \`{ status: number, message: string }\` 형태의 바디를 가집니다.

      단, 성공을 제외한 모든 예외 상태코드의 Response Body는 개발 편의를 위한 것이므로 코드에서는 사용하지 않는 것을 권장드립니다.
      `,
    )
    .setVersion('0.1.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
