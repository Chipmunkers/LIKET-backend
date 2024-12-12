import * as request from 'supertest';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Map (e2e)', () => {
  const test = TestHelper.create(AppModule);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /map/culture/content/all', () => {
    // TODO: 범위 밖에 있는 컨텐츠는 안 보이는지 테스트 케이스 필요

    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get(`/map/culture-content/all`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          'top-x': 127,
          'top-y': 30,
          'bottom-x': 128,
          'bottom-y': 29,
        })
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('No token', async () => {
      await request(test.getServer())
        .get(`/map/culture-content/all`)
        .query({
          'top-x': 127,
          'top-y': 30,
          'bottom-x': 128,
          'bottom-y': 29,
        })
        .expect(200);
    });
  });

  describe('GET /map/culture-content/clustered/all', () => {
    // TODO: 범위 밖에 있는 컨텐츠는 안 보이는지 테스트 케이스 필요

    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get(`/map/culture-content/clustered/all`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          'top-x': 127,
          'top-y': 30,
          'bottom-x': 128,
          'bottom-y': 29,
          level: 1,
        })
        .expect(200);

      expect(response.body?.clusteredContentList).toBeDefined();
      expect(Array.isArray(response.body?.clusteredContentList)).toBe(true);
    });

    it('No token', async () => {
      await request(test.getServer())
        .get(`/map/culture-content/clustered/all`)
        .query({
          'top-x': 127,
          'top-y': 30,
          'bottom-x': 128,
          'bottom-y': 29,
          level: 1,
        })
        .expect(200);
    });
  });
});
