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

      console.log(
        contentList.map((content) => ({
          idx: content.idx,
          startDate: content.startDate,
          endDate: content.endDate,
        })),
      );

      expect(contentList.length).toBe(1);
      expect(contentList[0].idx).toBe(content4.idx);
    });
  });
});
