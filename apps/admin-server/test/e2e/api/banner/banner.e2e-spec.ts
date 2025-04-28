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

    it('Success - page test', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const bannerSeedList = await bannerSeedHelper.seedAll([
        { name: 'first banner' },
        { name: 'second banner' },
        { name: 'third banner' },
        { name: 'fourth banner' },
        { name: 'fifth banner' },
        { name: 'sixth banner' },
        { name: 'seventh banner' },
        { name: 'eighth banner' },
        { name: 'ninth banner' },
        { name: 'tenth banner' },
        { name: 'eleven banner' },
      ]);

      expect(bannerSeedList.length).toBe(11);

      const response = await request(test.getServer())
        .get('/banner/all')
        .set(`Authorization`, `Bearer ${adminUser.accessToken}`)
        .query({
          page: 2,
        })
        .expect(200);

      const responseBannerList: BannerEntity[] = response.body.bannerList;

      expect(responseBannerList.length).toBe(1);
    });

    it('fail - no access token', async () => {
      await request(test.getServer()).get('/banner/all').expect(401);
    });

    it('Success - order by desc test', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [firstBanner, secondBanner, thirdBanner] =
        await bannerSeedHelper.seedAll([
          { name: 'first banner' }, // created first
          { name: 'second banner' }, // created second
          { name: 'third banner' }, // created third
        ]);

      const response = await request(test.getServer())
        .get('/banner/all')
        .set(`Authorization`, `Bearer ${adminUser.accessToken}`)
        .query({
          order: 'desc',
        })
        .expect(200);

      const responseBannerList: BannerEntity[] = response.body.bannerList;

      expect(responseBannerList.map(({ idx }) => idx)).toStrictEqual([
        thirdBanner.idx,
        secondBanner.idx,
        firstBanner.idx,
      ]);
    });

    it('Success - order by asc test', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [firstBanner, secondBanner, thirdBanner] =
        await bannerSeedHelper.seedAll([
          { name: 'first banner' }, // created first
          { name: 'second banner' }, // created second
          { name: 'third banner' }, // created third
        ]);

      const response = await request(test.getServer())
        .get('/banner/all')
        .set(`Authorization`, `Bearer ${adminUser.accessToken}`)
        .query({
          order: 'asc',
        })
        .expect(200);

      const responseBannerList: BannerEntity[] = response.body.bannerList;

      expect(responseBannerList.map(({ idx }) => idx)).toStrictEqual([
        firstBanner.idx,
        secondBanner.idx,
        thirdBanner.idx,
      ]);
    });
  });

  describe('GET /banner/:idx', () => {
    it('Success - field check with deactivated banner', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const bannerSeed = await bannerSeedHelper.seed({
        name: 'banner-seed-test',
        imgPath: '/banner/test-banner.field-check.png',
        link: 'https://for-banner-field-check.test',
      });

      const response = await request(test.getServer())
        .get(`/banner/${bannerSeed.idx}`)
        .set(`Authorization`, `Bearer ${adminUser.accessToken}`)
        .expect(200);

      const selectBanner = await test.getPrisma().banner.findUniqueOrThrow({
        where: { idx: bannerSeed.idx },
      });

      const banner: BannerEntity = response.body.banner;
      expect(banner.idx).toBe(selectBanner.idx);
      expect(banner.name).toBe(selectBanner.name);
      expect(banner.link).toBe(selectBanner.link);
      expect(banner.imgPath).toBe(selectBanner.imgPath);
      expect(banner.activatedAt).toBe(null);
      expect(banner.createdAt).toBe(selectBanner.createdAt.toISOString());
    });

    it('Success - field check with activated banner', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const bannerSeed = await bannerSeedHelper.seed({
        order: 1,
      });

      const response = await request(test.getServer())
        .get(`/banner/${bannerSeed.idx}`)
        .set(`Authorization`, `Bearer ${adminUser.accessToken}`)
        .expect(200);

      const selectBanner = await test.getPrisma().banner.findUniqueOrThrow({
        where: { idx: bannerSeed.idx },
      });

      const banner: BannerEntity = response.body.banner;

      expect(banner.activatedAt).not.toBeNull();
    });
  });
});
