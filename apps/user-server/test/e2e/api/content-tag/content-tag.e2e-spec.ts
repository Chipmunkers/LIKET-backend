import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import { PrismaService } from '../../../../src/common/module/prisma/prisma.service';
import * as request from 'supertest';
import { PrismaSetting } from '../../setup/prisma.setup';
import { AppGlobalSetting } from '../../setup/app-global.setup';
import { LoginSetting, TestLoginUsers } from '../../setup/login-user.setup';
import { TestHelper } from '../../setup/test.helper';

describe('Content tag (e2e)', () => {
  const test = TestHelper.create();

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /culture-content/style/all', () => {
    it('Success with no token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/style/all')
        .expect(200);

      expect(response.body?.tagList).toBeDefined();
      expect(Array.isArray(response.body?.tagList)).toBe(true);
    });

    it('Success with token', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/style/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.tagList).toBeDefined();
      expect(Array.isArray(response.body?.tagList)).toBe(true);
    });

    it('Success with expired token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/style/all')
        .set('Authorization', `Bearer expired.token`)
        .expect(200);

      expect(response.body?.tagList).toBeDefined();
      expect(Array.isArray(response.body?.tagList)).toBe(true);
    });
  });

  describe('GET /culture-content/age/all', () => {
    it('Success with no token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/age/all')
        .expect(200);

      expect(response.body?.tagList).toBeDefined();
      expect(Array.isArray(response.body?.tagList)).toBe(true);
    });

    it('Success with token', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/age/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.tagList).toBeDefined();
      expect(Array.isArray(response.body?.tagList)).toBe(true);
    });

    it('Success with expired token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/age/all')
        .set('Authorization', `Bearer expired.token`)
        .expect(200);

      expect(response.body?.tagList).toBeDefined();
      expect(Array.isArray(response.body?.tagList)).toBe(true);
    });
  });

  describe('GET /culture-content/genre/all', () => {
    it('Success with no token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/genre/all')
        .expect(200);

      expect(response.body?.tagList).toBeDefined();
      expect(Array.isArray(response.body?.tagList)).toBe(true);
    });

    it('Success with token', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/genre/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.tagList).toBeDefined();
      expect(Array.isArray(response.body?.tagList)).toBe(true);
    });

    it('Success with expired token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/genre/all')
        .set('Authorization', `Bearer expired.token`)
        .expect(200);

      expect(response.body?.tagList).toBeDefined();
      expect(Array.isArray(response.body?.tagList)).toBe(true);
    });
  });
});
