import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/api/auth/auth.service';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/common/module/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import { EmailerService } from '../../../src/common/module/emailer/emailer.service';
import * as request from 'supertest';
import { EmailCertType } from '../../../src/api/email-cert/model/email-cert-type';
import { MailerService } from '@nestjs-modules/mailer';

describe('Terms of service (e2e)', () => {
  let app: INestApplication;
  let appModule: TestingModule;

  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();
    prisma.$transaction = async (callback) => {
      if (Array.isArray(callback)) {
        return await Promise.all(callback);
      }

      return callback(prisma);
    };
    await prisma.$queryRaw`BEGIN`;

    appModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();
    app = appModule.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    app.use(cookieParser(process.env.COOKIE_SECRET));

    await app.init();
  });

  afterEach(async () => {
    await prisma.$queryRaw`ROLLBACK`;
    await prisma.$disconnect();
    await appModule.close();
    await app.close();
  });

  describe('GET /tos/all', () => {
    it('Success', async () => {
      const response = await request(app.getHttpServer())
        .get('/tos/all')
        .expect(200);

      expect(response.body?.tosList).toBeDefined();
      expect(Array.isArray(response.body?.tosList)).toBe(true);
    });
  });

  describe('GET /tos/:idx', () => {
    it('Success', async () => {
      const idx = 1;

      const response = await request(app.getHttpServer())
        .get(`/tos/${idx}`)
        .expect(200);

      expect(response.body?.idx).toBe(1);
    });

    it('Invalid path parameter', async () => {
      const idx = 'invalid path'; // Invalid path parameter

      await request(app.getHttpServer()).get(`/tos/${idx}`).expect(400);
    });

    it('Non-existent terms of service', async () => {
      const idx = 999; // Non-existent terms of service idx

      await request(app.getHttpServer()).get(`/tos/${idx}`).expect(404);
    });
  });
});
