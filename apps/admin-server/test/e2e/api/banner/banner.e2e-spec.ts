import { CreateBannerDto } from 'apps/admin-server/src/api/banner/dto/request/create-banner.dto';
import { ActiveBannerEntity } from 'apps/admin-server/src/api/banner/entity/active-banner.entity';
import { BannerEntity } from 'apps/admin-server/src/api/banner/entity/banner.entity';
import { AppModule } from 'apps/admin-server/src/app.module';
import { TestHelper } from 'apps/admin-server/test/e2e/setup/test.helper';
import { BannerSeedHelper } from 'libs/testing';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { UpdateBannerDto } from 'apps/admin-server/src/api/banner/dto/request/update-banner.dto';

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

    it('Fail - no token', async () => {
      const bannerSeed = await bannerSeedHelper.seed({
        name: 'banner-seed-test',
        imgPath: '/banner/test-banner.field-check.png',
        link: 'https://for-banner-field-check.test',
      });

      await request(test.getServer())
        .get(`/banner/${bannerSeed.idx}`)
        .expect(401);
    });

    it('Fail - not found banner', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const neverExistBannerIdx = -1;

      await request(test.getServer())
        .get(`/banner/${neverExistBannerIdx}`)
        .set(`Authorization`, `Bearer ${adminUser.accessToken}`)
        .expect(404);
    });

    it('Fail - invalid banner idx', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const invalidBannerIdx = 'invalid-banner-idx';

      await request(test.getServer())
        .get(`/banner/${invalidBannerIdx}`)
        .set(`Authorization`, `Bearer ${adminUser.accessToken}`)
        .expect(400);
    });
  });

  describe('GET /banner/active/all', () => {
    it('Success - field check', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [firstBanner] = await bannerSeedHelper.seedAll([
        { order: 1 },
        { order: 2 },
        { order: 3 },
      ]);

      const response = await request(test.getServer())
        .get('/banner/active/all')
        .set('Authorization', `Bearer ${adminUser.accessToken}`);

      const bannerList: ActiveBannerEntity[] = response.body.bannerList;
      expect(bannerList.length).toBe(3);

      const selectBanner = await test.getPrisma().banner.findUniqueOrThrow({
        include: { ActiveBanner: true },
        where: { idx: firstBanner.idx },
      });
      const banner = bannerList[0];

      expect(banner.banner.idx).toBe(selectBanner.idx);
      expect(banner.banner.name).toBe(selectBanner.name);
      expect(banner.banner.link).toBe(selectBanner.link);
      expect(banner.banner.imgPath).toBe(selectBanner.imgPath);
      expect(banner.order).toBe(selectBanner.ActiveBanner?.order);
      expect(banner.banner.activatedAt).toBe(
        selectBanner.ActiveBanner?.activatedAt.toISOString(),
      );
      expect(banner.banner.createdAt).toBe(
        selectBanner.createdAt.toISOString(),
      );
    });

    it('Success - deactivated banner test', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [firstBanner, deactivatedBanner, thirdBanner] =
        await bannerSeedHelper.seedAll([
          { order: 1 },
          { order: null },
          { order: 2 },
          { order: null, deletedAt: new Date() },
        ]);

      const response = await request(test.getServer())
        .get('/banner/active/all')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(200);

      const responseBannerList: ActiveBannerEntity[] = response.body.bannerList;

      expect(
        responseBannerList.map(({ banner: { idx } }) => idx),
      ).toStrictEqual([firstBanner.idx, thirdBanner.idx]);
    });

    it('Success - order test', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [order2Banner, order3Banner, order1Banner, order4Banner] =
        await bannerSeedHelper.seedAll([
          { order: 2 },
          { order: 3 },
          { order: 1 },
          { order: 4 },
        ]);

      const response = await request(test.getServer())
        .get('/banner/active/all')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(200);

      const responseBannerList: ActiveBannerEntity[] = response.body.bannerList;

      expect(
        responseBannerList.map(({ banner: { idx } }) => idx),
      ).toStrictEqual([
        order1Banner.idx,
        order2Banner.idx,
        order3Banner.idx,
        order4Banner.idx,
      ]);
    });

    it('Fail - no token', async () => {
      await request(test.getServer()).get('/banner/active/all').expect(401);
    });
  });

  describe('POST /banner', () => {
    it('Success', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const dto: CreateBannerDto = {
        name: 'banner-test',
        file: {
          path: '/banner/img_test_001.png',
        },
        link: 'https://banner-test.linkg.url',
      };

      const response = await request(test.getServer())
        .post('/banner')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send(dto)
        .expect(200);

      const createdBannerIdx = response.body.idx;

      const banner = await test
        .getPrisma()
        .banner.findUniqueOrThrow({ where: { idx: createdBannerIdx } });

      expect(banner.name).toBe(dto.name);
      expect(banner.link).toBe(dto.link);
      expect(banner.imgPath).toBe(dto.file.path);
      expect(banner.deletedAt).toBeNull();
    });

    it('Fail - invalid name length', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const dto: CreateBannerDto = {
        name: faker.string.alpha(31),
        file: {
          path: '/banner/img_test_001.png',
        },
        link: 'https://banner-test.linkg.url',
      };

      await request(test.getServer())
        .post('/banner')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('Fail - name as null', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const dto = {
        name: null,
        file: {
          path: '/banner/img_test_001.png',
        },
        link: 'https://banner-test.linkg.url',
      };

      await request(test.getServer())
        .post('/banner')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('Fail - name is empty string', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const dto = {
        name: '',
        file: {
          path: '/banner/img_test_001.png',
        },
        link: 'https://banner-test.linkg.url',
      };

      await request(test.getServer())
        .post('/banner')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('Fail - path is empty string', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const dto = {
        name: 'banner-name',
        file: {
          path: '',
        },
        link: 'https://banner-test.linkg.url',
      };

      await request(test.getServer())
        .post('/banner')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('Fail - link is empty string', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const dto = {
        name: 'banner-name',
        file: {
          path: '/banner/img_test_001.png',
        },
        link: '',
      };

      await request(test.getServer())
        .post('/banner')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('Fail - invalid link length', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const dto = {
        name: 'banner-name',
        file: {
          path: '/banner/img_test_001.png',
        },
        link: faker.string.alpha(2001),
      };

      await request(test.getServer())
        .post('/banner')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('Fail - no token', async () => {
      const dto = {
        name: 'banner-name',
        file: {
          path: '/banner/img_test_001.png',
        },
        link: 'https://banner-test.url.test',
      };

      await request(test.getServer()).post('/banner').send(dto).expect(401);
    });
  });

  describe('PUT /banner/:idx', () => {
    it('Success - field check', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const seedBanner = await bannerSeedHelper.seed({
        deletedAt: null,
      });

      const dto: UpdateBannerDto = {
        name: 'banner-name',
        file: {
          path: '/banner/img_0001.png',
        },
        link: 'https://banner-test.url.test',
      };

      await request(test.getServer())
        .put(`/banner/${seedBanner.idx}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send(dto)
        .expect(201);

      const bannerAfterUpdate = await test
        .getPrisma()
        .banner.findUniqueOrThrow({
          where: { idx: seedBanner.idx },
        });

      expect(bannerAfterUpdate.name).toBe(dto.name);
      expect(bannerAfterUpdate.imgPath).toBe(dto.file.path);
      expect(bannerAfterUpdate.link).toBe(dto.link);
    });

    it('Fail - no token', async () => {
      const seedBanner = await bannerSeedHelper.seed({
        deletedAt: null,
      });

      const dto: UpdateBannerDto = {
        name: 'banner-name',
        file: {
          path: '/banner/img_0001.png',
        },
        link: 'https://banner-test.url.test',
      };

      await request(test.getServer())
        .put(`/banner/${seedBanner.idx}`)
        .send(dto)
        .expect(401);
    });

    it('Fail - banner not found', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const neverExistBannerIdx = -1;

      const dto: UpdateBannerDto = {
        name: 'banner-name',
        file: {
          path: '/banner/img_0001.png',
        },
        link: 'https://banner-test.url.test',
      };

      await request(test.getServer())
        .put(`/banner/${neverExistBannerIdx}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send(dto)
        .expect(404);
    });

    it('Fail - invalid banner idx', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const invalidBannerIdx = 'invalid-banner-idx';

      const dto: UpdateBannerDto = {
        name: 'banner-name',
        file: {
          path: '/banner/img_0001.png',
        },
        link: 'https://baner-test.url.test',
      };

      await request(test.getServer())
        .put(`/banner/${invalidBannerIdx}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send(dto)
        .expect(400);
    });
  });

  describe('DELETE /banner/:idx', () => {
    it('Success - deleted_at check', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const seedBanner = await bannerSeedHelper.seed({});

      await request(test.getServer())
        .delete(`/banner/${seedBanner.idx}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(201);

      const selectedBanner = await test.getPrisma().banner.findUniqueOrThrow({
        where: {
          idx: seedBanner.idx,
        },
      });

      expect(selectedBanner.deletedAt).not.toBeUndefined();
    });

    it('Fail - no token', async () => {
      const seedBanner = await bannerSeedHelper.seed({});

      await request(test.getServer())
        .delete(`/banner/${seedBanner.idx}`)
        .expect(401);
    });

    it('Fail - banner not found', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const neverExistBannerIdx = -1;

      await request(test.getServer())
        .delete(`/banner/${neverExistBannerIdx}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(404);
    });

    it('Fail - delete activated banner, order field check', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [order1Banner, order2Banner, order3Banner] =
        await bannerSeedHelper.seedAll([
          { order: 1 },
          { order: 2 },
          { order: 3 },
        ]);

      await request(test.getServer())
        .delete(`/banner/${order2Banner.idx}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(201);

      const order3BannerAfterDelete = await test
        .getPrisma()
        .activeBanner.findUniqueOrThrow({
          where: { idx: order3Banner.idx },
        });
      expect(order3BannerAfterDelete.order).toBe(2);

      const order1BannerAfterDelete = await test
        .getPrisma()
        .activeBanner.findUniqueOrThrow({
          where: { idx: order1Banner.idx },
        });
      expect(order1BannerAfterDelete.order).toBe(1);
    });

    it('Fail - attempt to delete a banner which is already deleted', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const alreadyDeletedBanner = await bannerSeedHelper.seed({
        deletedAt: new Date(),
      });

      await request(test.getServer())
        .delete(`/banner/${alreadyDeletedBanner.idx}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(404);
    });
  });

  describe('POST /banner/:idx/activate', () => {
    it('Success - check whether order field is changed', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const bannerSeed = await bannerSeedHelper.seed({
        order: null,
        deletedAt: null,
      });

      const selectedBannerBeforeActivating = await test
        .getPrisma()
        .activeBanner.findUnique({
          where: { idx: bannerSeed.idx },
        });

      expect(selectedBannerBeforeActivating).toBeNull();

      await request(test.getServer())
        .post(`/banner/${bannerSeed.idx}/activate`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(201);

      const selectedBanner = await test
        .getPrisma()
        .activeBanner.findUniqueOrThrow({
          where: { idx: bannerSeed.idx },
        });

      expect(selectedBanner.order).toBe(1);
    });

    it('Success - check order field', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [order1Banner, order2Banner, order3Banner, deactivatedBanner] =
        await bannerSeedHelper.seedAll([
          { order: 1 },
          { order: 2 },
          { order: 3 },
          { order: null },
        ]);

      await request(test.getServer())
        .post(`/banner/${deactivatedBanner.idx}/activate`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(201);

      const deactivatedBannerAfterActivating = await test
        .getPrisma()
        .activeBanner.findUniqueOrThrow({
          where: { idx: deactivatedBanner.idx },
        });

      expect(deactivatedBannerAfterActivating.order).toBe(4);
    });

    it('Fail - attempt to activate a banner which is already activated', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const alreadyActivatedBanner = await bannerSeedHelper.seed({ order: 1 });

      await request(test.getServer())
        .post(`/banner/${alreadyActivatedBanner.idx}/activate`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(409);
    });

    it('Fail - no token', async () => {
      const bannerSeed = await bannerSeedHelper.seed({ order: null });

      await request(test.getServer())
        .post(`/banner/${bannerSeed.idx}/activate`)
        .expect(401);
    });

    it('Fail - banner not found', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const neverExistBannerIdx = -1;

      await request(test.getServer())
        .post(`/banner/${neverExistBannerIdx}/activate`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(404);
    });

    it('Fail - invalid path parameter', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const invalidBannerIdx = 'banner-idx-that-is-not-integer';

      await request(test.getServer())
        .post(`/banner/${invalidBannerIdx}/activate`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(400);
    });
  });

  describe('POST /banner/:idx/deactivate', () => {
    it('Success - order field check', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const activatedBanner = await bannerSeedHelper.seed({
        order: 1,
      });

      await request(test.getServer())
        .post(`/banner/${activatedBanner.idx}/deactivate`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(201);

      const activatedBannerAfterDeactivating = await test
        .getPrisma()
        .activeBanner.findUnique({
          where: { idx: activatedBanner.idx },
        });

      expect(activatedBannerAfterDeactivating).toBeNull();
    });

    it('Success - check order field of other banners', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [order1Banner, order2Banner, order3Banner, order4Banner] =
        await bannerSeedHelper.seedAll([
          { order: 1 },
          { order: 2 },
          { order: 3 },
          { order: 3 },
        ]);

      await request(test.getServer())
        .post(`/banner/${order3Banner.idx}/deactivate`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(201);

      const order1BannerAfterDeactivating = await test
        .getPrisma()
        .activeBanner.findUniqueOrThrow({
          where: { idx: order1Banner.idx },
        });

      const order2BannerAfterDeactivating = await test
        .getPrisma()
        .activeBanner.findUniqueOrThrow({
          where: { idx: order2Banner.idx },
        });

      const order4BannerAfterDeactivating = await test
        .getPrisma()
        .activeBanner.findUniqueOrThrow({
          where: { idx: order4Banner.idx },
        });

      expect(order1BannerAfterDeactivating.order).toBe(1);
      expect(order2BannerAfterDeactivating.order).toBe(2);
      expect(order4BannerAfterDeactivating.order).toBe(3);
    });

    it('Fail - no token', async () => {
      const bannerSeed = await bannerSeedHelper.seed({});

      await request(test.getServer())
        .post(`/banner/${bannerSeed.idx}/deactivate`)
        .expect(401);
    });

    it('Fail - banner not found', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const neverExistBannerIdx = -1;

      await request(test.getServer())
        .post(`/banner/${neverExistBannerIdx}/deactivate`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(404);
    });

    it('Fail - invalid banner idx', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const invalidBannerIdx = 'invalid-banner-idx';

      await request(test.getServer())
        .post(`/banner/${invalidBannerIdx}/deactivate`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(400);
    });

    it('Fail - attempt to deactivate banner which is already deactivated', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const alreadyDeactivatedBanner = await bannerSeedHelper.seed({
        order: null,
      });

      await request(test.getServer())
        .post(`/banner/${alreadyDeactivatedBanner.idx}/deactivate`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(409);
    });
  });

  describe('PUT /banner/:idx/order', () => {
    it('Success - field check after updating (2 -> 4)', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [order1Banner, order2Banner, order3Banner, order4Banner] =
        await bannerSeedHelper.seedAll([
          { order: 1 },
          { order: 2 },
          { order: 3 },
          { order: 4 },
        ]);

      expect(order1Banner.order).toBe(1);
      expect(order2Banner.order).toBe(2);
      expect(order3Banner.order).toBe(3);
      expect(order4Banner.order).toBe(4);

      await request(test.getServer())
        .put(`/banner/${order2Banner.idx}/order`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          order: 4,
        })
        .expect(201);

      const prisma = test.getPrisma();

      const [
        order1BannerAfterUpdating,
        order2BannerAfterUpdating,
        order3BannerAfterUpdating,
        order4BannerAfterUpdating,
      ] = await Promise.all([
        prisma.activeBanner.findUniqueOrThrow({
          where: { idx: order1Banner.idx },
        }),
        prisma.activeBanner.findUniqueOrThrow({
          where: { idx: order2Banner.idx },
        }),
        prisma.activeBanner.findUniqueOrThrow({
          where: { idx: order3Banner.idx },
        }),
        prisma.activeBanner.findUniqueOrThrow({
          where: { idx: order4Banner.idx },
        }),
      ]);

      expect(order1BannerAfterUpdating.order).toBe(1);
      expect(order2BannerAfterUpdating.order).toBe(4);
      expect(order3BannerAfterUpdating.order).toBe(2);
      expect(order4BannerAfterUpdating.order).toBe(3);
    });

    it('Success - field check after updating (4 -> 2)', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [order1Banner, order2Banner, order3Banner, order4Banner] =
        await bannerSeedHelper.seedAll([
          { order: 1 },
          { order: 2 },
          { order: 3 },
          { order: 4 },
        ]);

      expect(order1Banner.order).toBe(1);
      expect(order2Banner.order).toBe(2);
      expect(order3Banner.order).toBe(3);
      expect(order4Banner.order).toBe(4);

      await request(test.getServer())
        .put(`/banner/${order4Banner.idx}/order`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          order: 2,
        })
        .expect(201);

      const prisma = test.getPrisma();

      const [
        order1BannerAfterUpdating,
        order2BannerAfterUpdating,
        order3BannerAfterUpdating,
        order4BannerAfterUpdating,
      ] = await Promise.all([
        prisma.activeBanner.findUniqueOrThrow({
          where: { idx: order1Banner.idx },
        }),
        prisma.activeBanner.findUniqueOrThrow({
          where: { idx: order2Banner.idx },
        }),
        prisma.activeBanner.findUniqueOrThrow({
          where: { idx: order3Banner.idx },
        }),
        prisma.activeBanner.findUniqueOrThrow({
          where: { idx: order4Banner.idx },
        }),
      ]);

      expect(order1BannerAfterUpdating.order).toBe(1);
      expect(order2BannerAfterUpdating.order).toBe(3);
      expect(order3BannerAfterUpdating.order).toBe(4);
      expect(order4BannerAfterUpdating.order).toBe(2);
    });

    it('Fail - no token', async () => {
      const [bannerSeed] = await bannerSeedHelper.seedAll([
        { order: 1 },
        { order: 2 },
      ]);

      await request(test.getServer())
        .put(`/banner/${bannerSeed.idx}/order`)
        .send({
          order: 1,
        })
        .expect(401);
    });

    it('Fail - banner not found', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const neverExistBannerIdx = -1;

      await request(test.getServer())
        .put(`/banner/${neverExistBannerIdx}/order`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          order: 1,
        })
        .expect(404);
    });

    it('Fail - invalid path parameter', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const invalidBannerIdx = 'invalid-banner-idx';

      await request(test.getServer())
        .put(`/banner/${invalidBannerIdx}/order`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          order: 1,
        })
        .expect(400);
    });

    it('Fail - invalid order (not integer)', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const bannerSeed = await bannerSeedHelper.seed({ order: 1 });

      await request(test.getServer())
        .put(`/banner/${bannerSeed.idx}/order`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          order: 'null',
        })
        .expect(400);
    });

    it('Fail - attempt to update order with exceeded order', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [bannerSeed] = await bannerSeedHelper.seedAll([
        { order: 1 },
        { order: 2 },
      ]);

      const exceededOrder = 3;

      await request(test.getServer())
        .put(`/banner/${bannerSeed.idx}/order`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          order: exceededOrder,
        })
        .expect(400);
    });

    it('Fail - attempt to update order with same order', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const [bannerSeed] = await bannerSeedHelper.seedAll([
        { order: 1 },
        { order: 2 },
      ]);

      await request(test.getServer())
        .put(`/banner/${bannerSeed.idx}/order`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          order: bannerSeed.order,
        })
        .expect(409);
    });

    // TODO: order -1 에 대한 테스트 케이스 필요
  });
});
