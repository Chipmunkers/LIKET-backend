import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import { PrismaService } from '../../../../src/common/module/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { PrismaSetting } from '../../setup/prisma.setup';
import { TestHelper } from '../../setup/test.helper';

describe('Terms of service (e2e)', () => {
  const test = TestHelper.create();

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /tos/all', () => {
    it('Success', async () => {
      const response = await request(test.getServer())
        .get('/tos/all')
        .expect(200);

      expect(response.body?.tosList).toBeDefined();
      expect(Array.isArray(response.body?.tosList)).toBe(true);
    });
  });

  describe('GET /tos/:idx', () => {
    it('Success', async () => {
      const idx = 1;

      const response = await request(test.getServer())
        .get(`/tos/${idx}`)
        .expect(200);

      expect(response.body?.idx).toBe(1);
    });

    it('Invalid path parameter', async () => {
      const idx = 'invalid path'; // Invalid path parameter

      await request(test.getServer()).get(`/tos/${idx}`).expect(400);
    });

    it('Non-existent terms of service', async () => {
      const idx = 999; // Non-existent terms of service idx

      await request(test.getServer()).get(`/tos/${idx}`).expect(404);
    });
  });
});
