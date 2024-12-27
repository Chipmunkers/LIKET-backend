import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import * as request from 'supertest';

describe('Banner (e2e)', () => {
  const test = TestHelper.create(AppModule);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /banner/all', () => {
    it('Success with no token', async () => {
      const response = await request(test.getServer())
        .get('/banner/all')
        .expect(200);

      expect(response.body?.bannerList).toBeDefined();
      expect(Array.isArray(response.body?.bannerList)).toBe(true);
    });

    it('Success with token', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/banner/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.bannerList).toBeDefined();
      expect(Array.isArray(response.body?.bannerList)).toBe(true);
    });

    it('Success with expired token', async () => {
      const response = await request(test.getServer())
        .get('/banner/all')
        .set('Authorization', `Bearer expired.token`)
        .expect(200);

      expect(response.body?.bannerList).toBeDefined();
      expect(Array.isArray(response.body?.bannerList)).toBe(true);
    });
  });
});
