import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/api/auth/auth.service';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/common/module/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { CreateContentRequestDto } from '../../../src/api/culture-content/dto/create-content-request.dto';
import invalidCreateContentRequest from './invalid-create-content-request';
import { Reflector } from '@nestjs/core';

describe('Culture Content (e2e)', () => {
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

  describe('GET /culture-content/all', () => {
    it('Success: all content with token', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: true,
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(response.body?.count).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: get my contents', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          user: 1,
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(response.body?.count).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: get my not accepted contents', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(response.body?.count).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: genre filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(response.body?.count).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: age filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
          age: 2,
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(response.body?.count).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: style filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
          age: 2,
          style: 3,
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(response.body?.count).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: region filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
          age: 2,
          style: 3,
          region: '4514069000',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(response.body?.count).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: open filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
          age: 2,
          style: 3,
          region: '4514069000',
          open: true,
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(response.body?.count).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('No token', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .expect(401);
    });

    it('Filter other user', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          user: 2,
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(403);
    });

    it('Filter other user', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          user: 2,
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(403);
    });

    it('Filter not accepted contents with other user', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 2,
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(403);
    });

    it('Valid DTO - 1', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);
    });

    it('Valid DTO - 2', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 2,
          age: 2,
          region: '4514069000',
          style: 3,
          open: false,
          orderby: 'like',
          search: '도라에몽',
          page: 1,
          order: 'asc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);
    });

    it('Invalid DTO - accept', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: 'invalid', // Invalid
          user: 2,
          genre: 1,
          age: 1,
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });

    it('Invalid DTO - accept', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: 0, // Invalid
          user: 2,
          genre: 1,
          age: 1,
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });

    it('Invalid DTO - user', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 'user', // Invalid
          genre: 1,
          age: 1,
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });

    it('Invalid DTO - genre', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 'genre', // Invalid
          age: 1,
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });

    it('Invalid DTO - age', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 'age', // Invalid
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });

    it('Invalid DTO - style', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 'style', // Invalid
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });

    it('Invalid DTO - open', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 1,
          open: 'open', // Invalid
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });

    it('Invalid DTO - orderby', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 1,
          open: true,
          orderby: 'orderby', // Invalid
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });

    it('Invalid DTO - search', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 1,
          open: true,
          orderby: 'time',
          search: '10글자이상되는검색어입니다.', // Invalid
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });

    it('Invalid DTO - page', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 1,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 'page', // Invalid
          order: 'desc',
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });

    it('Invalid DTO - order', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 1,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 1,
          order: 'order', // Invalid
        })
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(400);
    });
  });

  describe('GET /culture-content/soon-open/all', () => {
    it('Success with no token', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/soon-open/all')
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success with token', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/soon-open/all')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });
  });

  describe('GET /culture-content/soon-end/all', () => {
    it('Success with no token', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/soon-end/all')
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success with token', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/soon-end/all')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });
  });

  describe('GET /culture-content/all', () => {
    it('Success with no token', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/hot/all')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      for (const genre of response.body) {
        expect(Array.isArray(genre.contentList)).toBe(true);
      }
    });

    it('Success with token', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/hot/all')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      for (const genre of response.body) {
        expect(Array.isArray(genre.contentList)).toBe(true);
      }
    });
  });

  describe('GET /culture-content/hot-age/:ageIdx/all', () => {
    it('Success with no token', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/hot-age/1/all')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Success with token', async () => {
      const response = await request(app.getHttpServer())
        .get('/culture-content/hot-age/1/all')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Invalid age idx', async () => {
      await request(app.getHttpServer())
        .get('/culture-content/hot-age/invalid/all')
        .expect(400);
    });
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
      const loginUserToken = user1Token;

      const response = await request(app.getHttpServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(idx);
    });

    it('Not accepted content - no author', async () => {
      const idx = 2;
      const loginUserToken = user2Token;

      await request(app.getHttpServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
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
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(404);
    });

    it('Deleted content - no author', async () => {
      const idx = 3;
      const loginUserToken = user2Token;

      await request(app.getHttpServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(404);
    });
  });

  describe('POST /culture-content/:idx/like', () => {
    it("Success - like author's content", async () => {
      const idx = 1;
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);
    });

    it('Success - like for content user do not own', async () => {
      const idx = 1;
      const loginUserToken = user2Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);
    });

    it('Success - like not accepted content', async () => {
      const idx = 2;
      const loginUserToken = user2Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);
    });

    it('Duplicate like', async () => {
      const idx = 1;
      const loginUserToken = user1Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(409);
    });

    it('Duplicate like, like the other user', async () => {
      const idx = 1;
      const loginUserToken = user1Token;
      const otherLoingUserToken = user2Token;

      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(409);

      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${otherLoingUserToken}`)
        .expect(201);
    });

    it('No token', async () => {
      const idx = 1; // Non-existent content idx

      // 좋아요 취소하기
      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .expect(401);
    });
  });

  describe('DELETE /culture-content/:idx/like', () => {
    it("Success - author's content", async () => {
      const idx = 1;
      const loginUserToken = user1Token;

      // 좋아요 누르기
      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);

      // 좋아요 취소하기
      await request(app.getHttpServer())
        .delete(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);
    });

    it('Success - Non-author cancels like', async () => {
      const idx = 1;
      const loginUserToken = user1Token;

      // 좋아요 누르기
      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);

      // 좋아요 취소하기
      await request(app.getHttpServer())
        .delete(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);
    });

    it('Cancel like (already unliked)', async () => {
      const idx = 1;
      const loginUserToken = user1Token;

      // 좋아요 취소하기
      await request(app.getHttpServer())
        .delete(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(409);
    });

    it('Success - like again', async () => {
      const idx = 1;
      const loginUserToken = user1Token;

      // 좋아요 누르기
      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);

      // 좋아요 취소하기
      await request(app.getHttpServer())
        .delete(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);

      // 좋아요 누르기
      await request(app.getHttpServer())
        .post(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);
    });

    it('Cancel like non-existent content', async () => {
      const idx = 99999; // Non-existent content idx
      const loginUserToken = user1Token;

      // 좋아요 취소하기
      await request(app.getHttpServer())
        .delete(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(404);
    });

    it('Invalid path parameter', async () => {
      const idx = 'invalidPathParameter'; // Non-existent content idx
      const loginUserToken = user1Token;

      // 좋아요 취소하기
      await request(app.getHttpServer())
        .delete(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(400);
    });

    it('No token', async () => {
      const idx = 1;

      // 좋아요 취소하기
      await request(app.getHttpServer())
        .delete(`/culture-content/${idx}/like`)
        // No token
        .expect(401);
    });
  });

  describe('POST /culture-content/request', () => {
    it('Success', async () => {
      const createDto: CreateContentRequestDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };
      const loginUserToken = user1Token;

      const response = await request(app.getHttpServer())
        .post('/culture-content/request')
        .set('Authorization', `Bearer ${loginUserToken}`)
        .send(createDto)
        .expect(200);

      expect(response.body?.idx).toBeDefined();
    });

    it('No token', async () => {
      const createDto: CreateContentRequestDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };

      await request(app.getHttpServer())
        .post('/culture-content/request')
        .send(createDto)
        .expect(401);
    });

    it('Invalid dto', async () => {
      const loginUserToken = user1Token;

      for (const dto of invalidCreateContentRequest()) {
        await request(app.getHttpServer())
          .post('/culture-content/request')
          .set('Authorization', `Bearer ${loginUserToken}`)
          .send(dto)
          .expect(400);
      }
    });
  });

  describe('PUT /culture-content/request/:idx', () => {
    it('Success', async () => {
      const createDto: CreateContentRequestDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };
      const loginUserToken = user1Token;
      const idx = 2;

      await request(app.getHttpServer())
        .put(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .send(createDto)
        .expect(201);
    });

    it('Non author update content', async () => {
      const createDto: CreateContentRequestDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };
      const loginUserToken = user2Token; // Non author
      const idx = 2;

      await request(app.getHttpServer())
        .put(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .send(createDto)
        .expect(403);
    });

    it('Update non-existent content', async () => {
      const createDto: CreateContentRequestDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };
      const loginUserToken = user1Token;
      const idx = 9999; // Non-existent content

      await request(app.getHttpServer())
        .put(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .send(createDto)
        .expect(404);
    });

    it('Update accepted content', async () => {
      const createDto: CreateContentRequestDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };
      const loginUserToken = user1Token;
      const idx = 1; // Accepted content

      await request(app.getHttpServer())
        .put(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .send(createDto)
        .expect(409);
    });
  });

  describe('DELETE /culture-content/request/:idx', () => {
    it('Success', async () => {
      const loginUserToken = user1Token;
      const idx = 2;

      await request(app.getHttpServer())
        .delete(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(201);
    });

    it('Non author delete content', async () => {
      const loginUserToken = user2Token; // Non author
      const idx = 2;

      await request(app.getHttpServer())
        .delete(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(403);
    });

    it('Delete non-existent content', async () => {
      const loginUserToken = user2Token;
      const idx = 9999; // Non-existent content

      await request(app.getHttpServer())
        .delete(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(404);
    });

    it('No token', async () => {
      const loginUserToken = null; // No token
      const idx = 2;

      await request(app.getHttpServer())
        .delete(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(401);
    });

    it('Accepted content', async () => {
      const loginUserToken = user1Token;
      const idx = 1; // Accepted content

      await request(app.getHttpServer())
        .delete(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(409);
    });

    it('Invalid path parameter', async () => {
      const loginUserToken = user1Token;
      const idx = 'invalid idx'; // Invalid path parameter

      await request(app.getHttpServer())
        .delete(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUserToken}`)
        .expect(400);
    });
  });
});
