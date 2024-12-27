import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { TosSeedHelper } from 'libs/testing';
import * as request from 'supertest';

describe('Terms of service (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const tosSeedHelper = test.seedHelper(TosSeedHelper);

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
      const tosSeed = await tosSeedHelper.seed({});

      const response = await request(test.getServer())
        .get(`/tos/${tosSeed.idx}`)
        .expect(200);

      expect(response.body?.idx).toBe(tosSeed.idx);
      expect(response.body?.title).toBe(tosSeed.title);
      expect(response.body?.contents).toBe(tosSeed.contents);
      expect(response.body?.isEssential).toBe(tosSeed.isEssential);
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
