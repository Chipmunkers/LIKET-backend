import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import { PrismaService } from '../../../../src/common/module/prisma/prisma.service';
import * as request from 'supertest';
import { PrismaSetting } from '../../setup/prisma.setup';
import { AppGlobalSetting } from '../../setup/app-global.setup';
import { LoginSetting, TestLoginUsers } from '../../setup/login-user.setup';

describe('Banner (e2e)', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  const prismaSetting = PrismaSetting.setup();

  let loginUsers: TestLoginUsers;

  beforeEach(async () => {
    await prismaSetting.BEGIN();

    appModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaSetting.getPrisma())
      .compile();
    app = appModule.createNestApplication();
    AppGlobalSetting.setup(app);
    await app.init();

    loginUsers = await LoginSetting.setup(loginUsers, app);
  });

  afterEach(async () => {
    prismaSetting.ROLLBACK();
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
      const loginUser = loginUsers.user1;

      const response = await request(app.getHttpServer())
        .get('/banner/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
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
