import { ContentEntity } from 'apps/admin-server/src/api/culture-content/entity/content.entity';
import { SummaryContentEntity } from 'apps/admin-server/src/api/culture-content/entity/summary-content.entity';
import { AppModule } from 'apps/admin-server/src/app.module';
import { TestHelper } from 'apps/admin-server/test/e2e/setup/test.helper';
import { CultureContentSeedHelper } from 'libs/testing';
import * as request from 'supertest';

describe('Culture Content (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const contentSeedHelper = test.seedHelper(CultureContentSeedHelper);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /culture-content/all', () => {
    it('success', async () => {
      const admin = test.getLoginHelper().getAdminUser1();

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .set(`Authorization`, `Bearer ${admin.accessToken}`)
        .expect(200);

      const result = response.body;

      expect(Array.isArray(result.contentList)).toBeTruthy();
    });

    it('no token', async () => {
      await request(test.getServer()).get('/culture-content/all').expect(401);
    });

    it('success - with state query parameter: continue 1', async () => {
      const admin = test.getLoginHelper().getAdminUser1();

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const threeDaysAfter = new Date();
      threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);

      await contentSeedHelper.seedAll([
        {
          userIdx: admin.idx,
          startDate: threeDaysAgo,
        },
        {
          userIdx: admin.idx,
          startDate: threeDaysAgo,
          endDate: threeDaysAfter,
        },
        {
          userIdx: admin.idx,
          startDate: threeDaysAfter,
          endDate: threeDaysAfter,
        },
      ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .set(`Authorization`, `Bearer ${admin.accessToken}`)
        .query({
          state: 'continue',
        })
        .expect(200);

      const contentList: SummaryContentEntity[] = response.body.contentList;

      expect(contentList.length).toBe(2);
    });

    it('success - with state query parameter continue 2', async () => {
      const admin = test.getLoginHelper().getAdminUser1();

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const threeDaysAfter = new Date();
      threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);

      const [content1, content2] = await contentSeedHelper.seedAll([
        {
          userIdx: admin.idx,
          startDate: threeDaysAfter,
        },
        {
          userIdx: admin.idx,
          startDate: threeDaysAgo,
          endDate: threeDaysAfter,
        },
      ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .set(`Authorization`, `Bearer ${admin.accessToken}`)
        .query({
          state: 'continue',
        })
        .expect(200);

      const contentList: SummaryContentEntity[] = response.body.contentList;

      expect(contentList.length).toBe(1);
      expect(contentList[0].idx).toBe(content2.idx);
    });

    it('success - with state query parameter: soon-end 1', async () => {
      const admin = test.getLoginHelper().getAdminUser1();

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const threeDaysAfter = new Date();
      threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);

      const [content1, content2] = await contentSeedHelper.seedAll([
        {
          userIdx: admin.idx,
          startDate: threeDaysAfter,
        },
        {
          userIdx: admin.idx,
          startDate: threeDaysAgo,
          endDate: threeDaysAfter,
        },
      ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .set(`Authorization`, `Bearer ${admin.accessToken}`)
        .query({
          state: 'soon-end',
        })
        .expect(200);

      const contentList: SummaryContentEntity[] = response.body.contentList;

      expect(contentList.length).toBe(1);
      expect(contentList[0].idx).toBe(content2.idx);
    });

    it('success - with state query parameter: soon-open 1', async () => {
      const admin = test.getLoginHelper().getAdminUser1();

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const threeDaysAfter = new Date();
      threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);

      const [content1, content2] = await contentSeedHelper.seedAll([
        {
          userIdx: admin.idx,
          startDate: threeDaysAfter,
        },
        {
          userIdx: admin.idx,
          startDate: threeDaysAgo,
          endDate: threeDaysAfter,
        },
      ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .set(`Authorization`, `Bearer ${admin.accessToken}`)
        .query({
          state: 'soon-open',
        })
        .expect(200);

      const contentList: SummaryContentEntity[] = response.body.contentList;

      expect(contentList.length).toBe(1);
      expect(contentList[0].idx).toBe(content1.idx);
    });

    it('success - with state query parameter: end 1', async () => {
      const admin = test.getLoginHelper().getAdminUser1();

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const threeDaysAfter = new Date();
      threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);

      const [content1, content2, content3, content4] =
        await contentSeedHelper.seedAll([
          {
            userIdx: admin.idx,
            startDate: threeDaysAfter, // -3 ~ null
            endDate: null,
          },
          {
            userIdx: admin.idx,
            startDate: threeDaysAgo, // -3 ~ 3
            endDate: threeDaysAfter,
          },
          {
            userIdx: admin.idx,
            startDate: threeDaysAfter, // 3 ~ 3
            endDate: threeDaysAfter,
          },
          {
            userIdx: admin.idx,
            startDate: threeDaysAgo, // -3 ~ -3
            endDate: threeDaysAgo,
          },
        ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .set(`Authorization`, `Bearer ${admin.accessToken}`)
        .query({
          state: 'end',
        })
        .expect(200);

      const contentList: SummaryContentEntity[] = response.body.contentList;

      expect(contentList.length).toBe(1);
      expect(contentList[0].idx).toBe(content4.idx);
    });
  });

  describe('GET /culture-content/:idx', () => {
    it('Success -field check', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const contentSeed = await contentSeedHelper.seed({
        userIdx: adminUser.idx,
      });

      const response = await request(test.getServer())
        .get(`/culture-content/${contentSeed.idx}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(200);

      const contentData = await test
        .getPrisma()
        .cultureContent.findUniqueOrThrow({
          include: {
            User: {
              include: {
                BlockReason: true,
              },
            },
            Location: true,
            Style: {
              include: { Style: true },
            },
            Age: true,
            Genre: true,
            ContentImg: true,
          },
          where: { idx: contentSeed.idx },
        });

      const content: ContentEntity = response.body.content;

      expect(content.idx).toBe(contentData.idx);
      expect(content.title).toBe(contentData.title);
      expect(content.imgList.sort()).toStrictEqual(
        contentData.ContentImg.map(({ imgPath }) => imgPath).sort(),
      );
      expect(content.genre.idx).toBe(contentData.Genre.idx);
      expect(content.genre.name).toBe(contentData.Genre.name);
      expect(content.startDate).toBe(contentData.startDate.toISOString());
      expect(content.endDate).toBe(contentData.endDate?.toISOString() || null);
      expect(content.user.idx).toBe(contentData.User.idx);
      expect(content.user.profileImgPath).toBe(contentData.User.profileImgPath);
      expect(content.user.nickname).toBe(contentData.User.nickname);
      expect(content.user.provider).toBe(contentData.User.provider);
      expect(content.user.email).toBe(contentData.User.email);
      expect(content.user.gender).toBe(contentData.User.gender);
      expect(content.user.birth).toBe(contentData.User.birth);
      expect(content.user.blockReason).toBe(
        contentData.User.BlockReason[0] || null,
      );
      expect(content.user.reportCount).toBe(contentData.User.reportCount);
      expect(content.user.createdAt).toBe(
        contentData.User.createdAt.toISOString(),
      );
      expect(content.user.deletedAt).toBe(
        contentData.User.deletedAt?.toISOString() || null,
      );
      expect(content.age.idx).toBe(contentData.Age.idx);
      expect(content.age.name).toBe(contentData.Age.name);
      expect(content.styleList.sort()).toStrictEqual(
        contentData.Style.map(({ Style: { idx, name } }) => ({
          idx,
          name,
        })).sort(),
      );
      expect(content.location.address).toBe(contentData.Location.address);
      expect(content.location.bCode).toBe(contentData.Location.bCode);
      expect(content.location.hCode).toBe(contentData.Location.hCode);
      expect(content.location.detailAddress).toBe(
        contentData.Location.detailAddress,
      );
      expect(content.location.region1Depth).toBe(
        contentData.Location.region1Depth,
      );
      expect(content.location.region2Depth).toBe(
        contentData.Location.region2Depth,
      );
      expect(content.location.positionX).toBe(contentData.Location.positionX);
      expect(content.location.positionY).toBe(contentData.Location.positionY);
      expect(content.createdAt).toBe(contentData.createdAt.toISOString());
      expect(content.acceptedAt).toBe(
        contentData.acceptedAt?.toISOString() || null,
      );
      expect(content.openTime).toBe(contentData.openTime);
      expect(content.description).toBe(contentData.description);
      expect(content.websiteLink).toBe(contentData.websiteLink);
      expect(content.isFee).toBe(contentData.isFee);
      expect(content.isReservation).toBe(contentData.isReservation);
      expect(content.isPet).toBe(contentData.isPet);
      expect(content.isParking).toBe(contentData.isParking);
      expect(content.id).toBe(contentData.id);
    });

    it('Fail - no token', async () => {
      const adminUser = test.getLoginHelper().getAdminUser1();

      const contentSeed = await contentSeedHelper.seed({
        userIdx: adminUser.idx,
      });

      await request(test.getServer())
        .get(`/culture-content/${contentSeed.idx}`)
        .expect(401);
    });
  });
});
