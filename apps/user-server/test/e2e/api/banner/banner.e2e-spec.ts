import { BannerEntity } from 'apps/user-server/src/api/banner/entity/banner.entity';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { BannerSeedHelper } from 'libs/testing/seed/banner/banner-seed.helper';
import * as request from 'supertest';

describe('Banner (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const bannerSeedHelper = test.seedHelper(BannerSeedHelper);

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

    it('Success - banner order test', async () => {
      const [banner1, banner2, notActivatedBanner] =
        await bannerSeedHelper.seedAll([
          {
            order: 2,
          },
          {
            order: 1,
          },
          {
            order: null,
          },
          {
            order: null,
            deletedAt: new Date(),
          },
        ]);

      const response = await request(test.getServer())
        .get('/banner/all')
        .expect(200);

      const bannerList: BannerEntity[] = response.body.bannerList;

      expect(bannerList.map(({ idx }) => idx)).toStrictEqual([
        banner2.idx,
        banner1.idx,
      ]);
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
