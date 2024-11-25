import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaSetting } from '../../setup/prisma.setup';
import { LoginSetting, TestLoginUsers } from '../../setup/login-user.setup';
import { AppModule } from '../../../../src/app.module';
import { PrismaService } from '../../../../src/common/module/prisma/prisma.service';
import { AppGlobalSetting } from '../../setup/app-global.setup';
import * as request from 'supertest';
import { TestHelper } from '../../setup/test.helper';

describe('Inquiry (e2e)', () => {
  const test = TestHelper.create();

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /inquiry/all', () => {
    it('Success - user1', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/inquiry/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.inquiryList).toBeDefined();
      expect(Array.isArray(response.body.inquiryList)).toBe(true);
      expect(response.body.inquiryList.length).toBe(3);
    });

    it('Success - user2', async () => {
      const loginUser = test.getLoginUsers().user2;

      const response = await request(test.getServer())
        .get('/inquiry/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.inquiryList).toBeDefined();
      expect(Array.isArray(response.body.inquiryList)).toBe(true);
      expect(response.body.inquiryList.length).toBe(0);
    });

    it('No token', async () => {
      await request(test.getServer())
        .get('/inquiry/all')
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Invalid DTO - page', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/inquiry/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          page: 'invalid', // Invalid
        })
        .expect(400);
    });
  });

  describe('GET /inquiry/:idx', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;
      const idx = 1;

      const response = await request(test.getServer())
        .get(`/inquiry/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.idx).toBeDefined();
      expect(response.body.idx).toBe(1);
    });

    it('Non-existent inquiry', async () => {
      const loginUser = test.getLoginUsers().user1;
      const idx = 9999; // Non-existent inquiry

      await request(test.getServer())
        .get(`/inquiry/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('No token', async () => {
      const idx = 1;

      await request(test.getServer())
        .get(`/inquiry/${idx}`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Permission denied - non author user', async () => {
      const loginUser = test.getLoginUsers().user2;
      const idx = 1;

      await request(test.getServer())
        .get(`/inquiry/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });
  });

  describe('POST /inquiry', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        contents: 'test-contents',
        imgList: [],
        typeIdx: 1,
      };

      const response = await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(200);

      expect(response.body?.idx).toBeDefined();
    });

    it('No token', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        contents: 'test-contents',
        imgList: [],
        typeIdx: 1,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${null}`)
        .send(createDto)
        .expect(401);
    });

    it('Invalid DTO - title', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        contents: 'test-contents',
        imgList: [],
        typeIdx: 1,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(400);
    });

    it('Invalid DTO - contents', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        imgList: [],
        typeIdx: 1,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(400);
    });

    it('Invalid DTO - imgList', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        typeIdx: 1,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(400);
    });

    it('Invalid DTO - imgList', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        contents: 'test-contents',
        typeIdx: 1,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(400);
    });

    it('Invalid DTO - typeIdx', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        contents: 'test-contents',
        imgList: [],
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(400);
    });

    it('Invalid DTO - no typeIdx', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        contents: 'test-contents',
        imgList: [],
        typeIdx: 999,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(500);
    });
  });

  describe('DELETE /inquiry/:idx', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      // 문의 생성
      const response = await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          title: 'title',
          contents: 'test-contents',
          imgList: [],
          typeIdx: 1,
        })
        .expect(200);
      expect(response.body?.idx).toBeDefined();
      const createdInquiry = response.body;

      await request(test.getServer())
        .delete(`/inquiry/${createdInquiry.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('No token', async () => {
      await request(test.getServer())
        .delete(`/inquiry/1`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Permission denied - non author user', async () => {
      const loginUser = test.getLoginUsers().user2;
      const idx = 1;

      await request(test.getServer())
        .delete(`/inquiry/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Non-existent inquiry', async () => {
      const loginUser = test.getLoginUsers().user2;
      const idx = 999999; // Non-existent inquiry

      await request(test.getServer())
        .delete(`/inquiry/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('Delete twice', async () => {
      const loginUser = test.getLoginUsers().user1;

      // 문의 생성
      const response = await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          title: 'title',
          contents: 'test-contents',
          imgList: [],
          typeIdx: 1,
        })
        .expect(200);
      expect(response.body?.idx).toBeDefined();
      const createdInquiry = response.body;

      await request(test.getServer())
        .delete(`/inquiry/${createdInquiry.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(test.getServer())
        .delete(`/inquiry/${createdInquiry.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });
  });
});
