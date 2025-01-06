import { AppModule } from 'apps/admin-server/src/app.module';
import { TestHelper } from 'apps/admin-server/test/e2e/setup/test.helper';
import * as request from 'supertest';

describe('Culture Content (e2e)', () => {
  const test = TestHelper.create(AppModule);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /culture-content/all', () => {
    it('success', async () => {
      const admin = test.getLoginHelper().getAdminUser1();

      await request(test.getServer())
        .get('/culture-content/all')
        .set(`Authorization`, `Bearer ${admin.accessToken}`)
        .expect(200);
    });

    it('no token', async () => {
      await request(test.getServer()).get('/culture-content/all').expect(401);
    });
  });
});
