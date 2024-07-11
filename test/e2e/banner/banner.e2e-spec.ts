import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/common/module/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import { AuthService } from '../../../src/api/auth/auth.service';
import * as request from 'supertest';

describe('Banner (e2e)', () => {
  let app: INestApplication;
  let appModule: TestingModule;

  let authService: AuthService;

  let prisma: PrismaClient;

  let user1Token: string;

  beforeEach(async () => {
    prisma = new PrismaClient();
    await prisma.$queryRaw`BEGIN`;

    appModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();
    app = appModule.createNestApplication();

    app.use(cookieParser(process.env.COOKIE_SECRET));

    await app.init();

    authService = appModule.get(AuthService);

    user1Token = (
      await authService.login({
        email: 'user1@gmail.com',
        pw: 'aa12341234**',
      })
    ).accessToken;
  });

  afterEach(async () => {
    await prisma.$queryRaw`ROLLBACK`;
    await prisma.$disconnect();
    await appModule.close();
    await app.close();
  });

  describe('GET /banner/all', () => {
    it('Success with no token', async () => {
      const response = await request(app.getHttpServer())
        .get('/banner/all')
        .expect(200);

      expect(response.body?.bannerList).toBeDefined();
      expect(Array.isArray(response.body?.bannerList)).toBe(true);
    });

    it('Success with token', async () => {
      const response = await request(app.getHttpServer())
        .get('/banner/all')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.bannerList).toBeDefined();
      expect(Array.isArray(response.body?.bannerList)).toBe(true);
    });

    it('Success with expired token', async () => {
      const response = await request(app.getHttpServer())
        .get('/banner/all')
        .set('Authorization', `Bearer expired.token`)
        .expect(200);

      expect(response.body?.bannerList).toBeDefined();
      expect(Array.isArray(response.body?.bannerList)).toBe(true);
    });
  });
});
