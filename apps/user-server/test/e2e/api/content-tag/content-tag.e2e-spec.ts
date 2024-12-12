import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import * as request from 'supertest';

describe('Content tag (e2e)', () => {
  const test = TestHelper.create(AppModule);

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
