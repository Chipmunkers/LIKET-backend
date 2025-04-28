import { BannerEntity } from 'apps/admin-server/src/api/banner/entity/banner.entity';
import { AppModule } from 'apps/admin-server/src/app.module';
import { TestHelper } from 'apps/admin-server/test/e2e/setup/test.helper';
import { BannerSeedHelper } from 'libs/testing';
import * as request from 'supertest';

describe('Banner (e2e', () => {
  const test = TestHelper.create(AppModule);
  const bannerSeedHelper = test.seedHelper(BannerSeedHelper);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /banner/all', () => {
    it('Success -field check', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [firstBannerSeed] = await bannerSeedHelper.seedAll([
        {
          name: 'first banner',
          imgPath: '/banner/img.png',
          link: 'https://test.url',
          order: 1,
        },
        {
          name: 'second banner',
          imgPath: '/banner/img2.png',
          link: 'https://test2.url',
        },
        {
          name: 'third banner',
          imgPath: '/banner/img3.png',
          link: 'https://test3.url',
          deletedAt: new Date(),
        },
      ]);

      const response = await request(test.getServer())
        .get('/banner/all')
        .set(`Authorization`, `Bearer ${adminUser.accessToken}`)
        .expect(200);

      const bannerList: BannerEntity[] = response.body.bannerList;
      const count: number = response.body.count;

      expect(Array.isArray(bannerList)).toBeTruthy();
      expect(count).toBe(2);

      const firstBanner = bannerList.find(
        (banner) => banner.idx === firstBannerSeed?.idx,
      );

      expect(firstBanner).not.toBeUndefined();
      expect((firstBanner as BannerEntity).idx).toBe(firstBannerSeed.idx);
      expect((firstBanner as BannerEntity).imgPath).toBe(
        firstBannerSeed.imgPath,
      );
      expect((firstBanner as BannerEntity).link).toBe(firstBannerSeed.link);
      expect((firstBanner as BannerEntity).name).toBe(firstBannerSeed.name);
    });
  });
});
