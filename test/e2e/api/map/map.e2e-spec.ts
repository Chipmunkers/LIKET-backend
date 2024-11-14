import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import { PrismaService } from '../../../../src/common/module/prisma/prisma.service';
import { PrismaSetting } from '../../setup/prisma.setup';
import { AppGlobalSetting } from '../../setup/app-global.setup';
import { LoginSetting, TestLoginUsers } from '../../setup/login-user.setup';
import * as request from 'supertest';

describe('Map (e2e)', () => {
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

  describe('GET /map/culture/content/all', () => {
    // TODO: 범위 밖에 있는 컨텐츠는 안 보이는지 테스트 케이스 필요

    it('Success', async () => {
      const loginUser = loginUsers.user1;

      const response = await request(app.getHttpServer())
        .get(`/map/culture-content/all`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          'top-x': 127,
          'top-y': 30,
          'bottom-x': 128,
          'bottom-y': 29,
        })
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('No token', async () => {
      await request(app.getHttpServer())
        .get(`/map/culture-content/all`)
        .query({
          'top-x': 127,
          'top-y': 30,
          'bottom-x': 128,
          'bottom-y': 29,
        })
        .expect(200);
    });
  });

  describe('GET /map/culture-content/clustered/all', () => {
    // TODO: 범위 밖에 있는 컨텐츠는 안 보이는지 테스트 케이스 필요

    it('Success', async () => {
      const loginUser = loginUsers.user1;

      const response = await request(app.getHttpServer())
        .get(`/map/culture-content/clustered/all`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          'top-x': 127,
          'top-y': 30,
          'bottom-x': 128,
          'bottom-y': 29,
          level: 1,
        })
        .expect(200);

      expect(response.body?.clusteredContentList).toBeDefined();
      expect(Array.isArray(response.body?.clusteredContentList)).toBe(true);
    });

    it('No token', async () => {
      await request(app.getHttpServer())
        .get(`/map/culture-content/clustered/all`)
        .query({
          'top-x': 127,
          'top-y': 30,
          'bottom-x': 128,
          'bottom-y': 29,
          level: 1,
        })
        .expect(200);
    });
  });
});
