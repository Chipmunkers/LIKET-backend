import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import { PrismaService } from '../../../../src/common/module/prisma/prisma.service';
import * as request from 'supertest';
import { PrismaSetting } from '../../setup/prisma.setup';
import { AppGlobalSetting } from '../../setup/app-global.setup';
import { LoginSetting, TestLoginUsers } from '../../setup/login-user.setup';
import { ContentViewService } from '../../../../src/api/culture-content/content-view.service';

describe('Culture Content View (e2e)', () => {
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

    jest.useFakeTimers({
      advanceTimers: true,
    });
  });

  afterEach(async () => {
    prismaSetting.ROLLBACK();
    await appModule.close();
    await app.close();
    jest.useRealTimers();
  });

  afterAll(async () => {
    const keys = Object.keys(ContentViewService.EVENT_ID_MAP);

    for (const key of keys) {
      clearTimeout(ContentViewService.EVENT_ID_MAP[key]);
    }

    jest.clearAllTimers();
  });

  describe('GET /culture-content/:idx', () => {
    it('Success with no token', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/1')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
    });

    it('Non-existent content', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/9999999')
        .expect(404);
    });

    it('Not accepted content - author', async () => {
      const idx = 2;
      const loginUser = loginUsers.user1;

      const response = await request(app.getHttpServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(idx);
    });

    it('Not accepted content - no author', async () => {
      const idx = 2;
      const loginUser = loginUsers.user2;

      await request(app.getHttpServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Not accepted content - no token', async () => {
      const idx = 2;

      await request(app.getHttpServer())
        .get(`/culture-content/${idx}`)
        .expect(403);
    });

    it('Deleted content - author', async () => {
      const idx = 3;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('Deleted content - no author', async () => {
      const idx = 3;
      const loginUser = loginUsers.user2;

      await request(app.getHttpServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('Increase view count - no login', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/1')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
      expect(response.body.viewCount).toBe(0);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const secondResponse = await request(app.getHttpServer())
        .get('/culture-content/1')
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(1);
      expect(secondResponse.body.viewCount).toBe(0);
    });

    it('Increase view count - login', async () => {
      const loginUser = loginUsers.user2;
      const response = await request(app.getHttpServer())
        .get('/culture-content/1')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
      expect(response.body.viewCount).toBe(0);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const secondResponse = await request(app.getHttpServer())
        .get('/culture-content/1')
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(1);
      expect(secondResponse.body.viewCount).toBe(1);
    });

    it('Increase view count - multiple users', async () => {
      const loginUser = loginUsers.user2;
      const response = await request(app.getHttpServer())
        .get('/culture-content/1')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
      expect(response.body.viewCount).toBe(0);

      const loginUser2 = loginUsers.user1;
      const secondResponse = await request(app.getHttpServer())
        .get('/culture-content/1')
        .set('Authorization', `Bearer ${loginUser2.accessToken}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(1);
      expect(secondResponse.body.viewCount).toBe(0);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const lastResponse = await request(app.getHttpServer())
        .get('/culture-content/1')
        .expect(200);

      expect(lastResponse.body).toBeDefined();
      expect(lastResponse.body.idx).toBe(1);
      expect(lastResponse.body.viewCount).toBe(2);
    });

    it('Increase view count - one user', async () => {
      const loginUser = loginUsers.user2;
      const response = await request(app.getHttpServer())
        .get('/culture-content/1')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
      expect(response.body.viewCount).toBe(0);

      const secondResponse = await request(app.getHttpServer())
        .get('/culture-content/1')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(1);
      expect(secondResponse.body.viewCount).toBe(0);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const lastResponse = await request(app.getHttpServer())
        .get('/culture-content/1')
        .expect(200);

      expect(lastResponse.body).toBeDefined();
      expect(lastResponse.body.idx).toBe(1);
      expect(lastResponse.body.viewCount).toBe(1);
    });

    it('Increase view count - after cool down', async () => {
      const loginUser = loginUsers.user2;
      const response = await request(app.getHttpServer())
        .get('/culture-content/1')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
      expect(response.body.viewCount).toBe(0);

      const secondResponse = await request(app.getHttpServer())
        .get('/culture-content/1')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(1);
      expect(secondResponse.body.viewCount).toBe(0);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const thirdResponse = await request(app.getHttpServer())
        .get('/culture-content/1')
        .expect(200);

      expect(thirdResponse.body).toBeDefined();
      expect(thirdResponse.body.idx).toBe(1);
      expect(thirdResponse.body.viewCount).toBe(1);

      jest.advanceTimersByTime(ContentViewService.VIEW_COOL_DOWN);

      const fourthResponse = await request(app.getHttpServer())
        .get('/culture-content/1')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(fourthResponse.body).toBeDefined();
      expect(fourthResponse.body.idx).toBe(1);
      expect(fourthResponse.body.viewCount).toBe(1);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const lastResponse = await request(app.getHttpServer())
        .get('/culture-content/1')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(lastResponse.body).toBeDefined();
      expect(lastResponse.body.idx).toBe(1);
      expect(lastResponse.body.viewCount).toBe(2);
    });
  });
});
