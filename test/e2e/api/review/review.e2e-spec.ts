import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import { PrismaService } from '../../../../src/common/module/prisma/prisma.service';
import * as request from 'supertest';
import { PrismaSetting } from '../../setup/prisma.setup';
import { AppGlobalSetting } from '../../setup/app-global.setup';
import { LoginSetting, TestLoginUsers } from '../../setup/login-user.setup';

describe('Terms of service (e2e)', () => {
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

  describe('GET /review/all', () => {
    it('Success', async () => {
      const response = await request(app.getHttpServer())
        .get('/review/all')
        .query({
          content: 1,
          orderby: 'time',
          page: 1,
          order: 'desc',
        })
        .expect(200);

      expect(response.body?.reviewList).toBeDefined();
      expect(Array.isArray(response.body.reviewList)).toBe(true);
    });

    it('Attempt to get reviews of other user', async () => {
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          user: 2,
        })
        .expect(403);
    });

    it('Non-existent content', async () => {
      const loginUser = loginUsers.user1;
      const contentIdx = 99999; // Non-existent content

      await request(app.getHttpServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          content: contentIdx,
        })
        .expect(404);
    });

    it('Non-accepted content | author', async () => {
      const loginUser = loginUsers.user1;
      const contentIdx = 2;

      const response = await request(app.getHttpServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          content: contentIdx,
        })
        .expect(200);

      expect(response.body?.reviewList).toBeDefined();
      expect(Array.isArray(response.body.reviewList)).toBe(true);
    });

    it('Non-accepted content | author', async () => {
      const loginUser = loginUsers.user2;
      const contentIdx = 2;

      await request(app.getHttpServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          content: contentIdx,
        })
        .expect(403);
    });

    it('Invalid dto - content', async () => {
      await request(app.getHttpServer())
        .get('/review/all')
        .query({
          content: 'invalid', // Invalid content
          orderby: 'time',
          page: 1,
          order: 'desc',
        })
        .expect(400);
    });

    it('Invalid dto - user', async () => {
      await request(app.getHttpServer())
        .get('/review/all')
        .query({
          content: 1,
          user: 'invalid', // Invalid user
          orderby: 'time',
          page: 1,
          order: 'desc',
        })
        .expect(400);
    });

    it('Invalid dto - orderby', async () => {
      await request(app.getHttpServer())
        .get('/review/all')
        .query({
          content: 1,
          orderby: 'invalid', // Invalid orderby
          page: 1,
          order: 'desc',
        })
        .expect(400);
    });
  });

  describe('GET /review/:idx', () => {
    it('Success - no token', async () => {
      const reviewIdx = 1;

      const response = await request(app.getHttpServer())
        .get(`/review/${reviewIdx}`)
        .expect(200);

      expect(response.body?.idx).toBe(1);
    });

    it('Success - login', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      const response = await request(app.getHttpServer())
        .get(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.idx).toBe(1);
    });

    it('Non-existent review', async () => {
      const reviewIdx = 999999; // Non-existent review
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .get(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });
  });

  describe('GET /review/hot/all', () => {
    it('Success - no token', async () => {
      const response = await request(app.getHttpServer())
        .get('/review/hot/all')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Success - login', async () => {
      const loginUser = loginUsers.user1;

      const response = await request(app.getHttpServer())
        .get('/review/hot/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /culture-content/:idx/review', () => {
    it('Success', async () => {
      const contentIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(201);
    });

    it('No token', async () => {
      const contentIdx = 1;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${null}`)
        .send({
          title: 'review title',
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(401);
    });

    it('Non-existent content', async () => {
      const contentIdx = 99999; // Non-existent content
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(404);
    });

    it('Non-accepted content', async () => {
      const contentIdx = 2; // Non-existent content
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(404);
    });

    it('Invalid path parameter', async () => {
      const contentIdx = 'invalid'; // Invalid path parameter
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - starRating', async () => {
      const contentIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 'invalid', // Invalid star rating
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - description', async () => {
      const contentIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: '', // Invalid description
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - visit time', async () => {
      const contentIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: 'Invalid date', // Invalid visitTime
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - img list', async () => {
      const contentIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: new Date(),
          imgList: [], // Invalid img list
        })
        .expect(400);
    });
  });

  describe('PUT /review/:idx', () => {
    it('Success', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(201);
    });

    it('Non-existent review', async () => {
      const reviewIdx = 9999; // Non-existent review
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(404);
    });

    it('Attempt to update review of other user', async () => {
      const reviewIdx = 1; // Non-existent review
      const loginUser = loginUsers.user2;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(403);
    });

    it('Invalid path parameter', async () => {
      const contentIdx = 'invalid'; // Invalid path parameter
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .put(`/review/${contentIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - starRating', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 'invalid', // Invalid star rating
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - description', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: '', // Invalid description
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - visit time', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: 'Invalid date', // Invalid visitTime
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - img list', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: new Date(),
          imgList: [], // Invalid img list
        })
        .expect(400);
    });
  });

  describe('DELETE /review/:idx', () => {
    it('Success', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('No token', async () => {
      const reviewIdx = 'invalid'; // Invalid path parameter

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Non-existent review', async () => {
      const reviewIdx = 9999; // Non-existent review
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('Attempt to delete review of other user', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user2;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Invalid path parameter', async () => {
      const reviewIdx = 'invalid'; // Invalid path parameter
      const loginUser = loginUsers.user2;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });
  });

  describe('POST /review/:idx/like', () => {
    it('Success', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Duplicate like', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(409);
    });

    it('No token', async () => {
      const reviewIdx = 1;

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Like non-existent review', async () => {
      const reviewIdx = 9999; // Non-existent review
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });
  });

  describe('DELETE /review/:idx/like', () => {
    it('Success', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Cancel like (already unliked)', async () => {
      const reviewIdx = 1;
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(409);
    });

    it('Non-existent review', async () => {
      const reviewIdx = 999999; // Non-existent
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('No token', async () => {
      const reviewIdx = 1;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });
  });
});
