import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/api/auth/auth.service';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/common/module/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

describe('Terms of service (e2e)', () => {
  let app: INestApplication;
  let appModule: TestingModule;

  let authService: AuthService;

  let prisma: PrismaClient;

  let user1Token: string;
  let user2Token: string;

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

    authService = appModule.get(AuthService);

    user1Token = (
      await authService.login({
        email: 'user1@gmail.com',
        pw: 'aa12341234**',
      })
    ).accessToken;

    user2Token = (
      await authService.login({
        email: 'user2@gmail.com',
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUserToken}`)
        .query({
          user: 2,
        })
        .expect(403);
    });

    it('Non-existent content', async () => {
      const loginUserToken = user1Token;
      const contentIdx = 99999; // Non-existent content

      await request(app.getHttpServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUserToken}`)
        .query({
          content: contentIdx,
        })
        .expect(404);
    });

    it('Non-accepted content | author', async () => {
      const loginUserToken = user1Token;
      const contentIdx = 2;

      const response = await request(app.getHttpServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUserToken}`)
        .query({
          content: contentIdx,
        })
        .expect(200);

      expect(response.body?.reviewList).toBeDefined();
      expect(Array.isArray(response.body.reviewList)).toBe(true);
    });

    it('Non-accepted content | author', async () => {
      const loginUserToken = user2Token;
      const contentIdx = 2;

      await request(app.getHttpServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUser = user1Token;

      const response = await request(app.getHttpServer())
        .get(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser}`)
        .expect(200);

      expect(response.body?.idx).toBe(1);
    });

    it('Non-existent review', async () => {
      const reviewIdx = 999999; // Non-existent review
      const loginUser = user1Token;

      await request(app.getHttpServer())
        .get(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser}`)
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
      const loginUserToken = user1Token;

      const response = await request(app.getHttpServer())
        .get('/review/hot/all')
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /culture-content/:idx/review', () => {
    it('Success', async () => {
      const contentIdx = 1;
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = null; // no token

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user2Token;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .put(`/review/${contentIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);
    });

    it('No token', async () => {
      const reviewIdx = 'invalid'; // Invalid path parameter
      const loginUserToken = null;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(401);
    });

    it('Non-existent review', async () => {
      const reviewIdx = 9999; // Non-existent review
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(404);
    });

    it('Attempt to delete review of other user', async () => {
      const reviewIdx = 1;
      const loginUserToken = user2Token;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(403);
    });

    it('Invalid path parameter', async () => {
      const reviewIdx = 'invalid'; // Invalid path parameter
      const loginUserToken = user2Token;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(400);
    });
  });

  describe('POST /review/:idx/like', () => {
    it('Success', async () => {
      const reviewIdx = 1;
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);
    });

    it('Duplicate like', async () => {
      const reviewIdx = 1;
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(409);
    });

    it('No token', async () => {
      const reviewIdx = 1;
      const loginUserToken = null; // No token

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(401);
    });

    it('Like non-existent review', async () => {
      const reviewIdx = 9999; // Non-existent review
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(404);
    });
  });

  describe('DELETE /review/:idx/like', () => {
    it('Success', async () => {
      const reviewIdx = 1;
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);
    });

    it('Cancel like (already unliked)', async () => {
      const reviewIdx = 1;
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(409);
    });

    it('Non-existent review', async () => {
      const reviewIdx = 999999; // Non-existent
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(404);
    });

    it('No token', async () => {
      const reviewIdx = 1;
      const loginUserToken = null; // No token

      await request(app.getHttpServer())
        .delete(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(401);
    });
  });
});
