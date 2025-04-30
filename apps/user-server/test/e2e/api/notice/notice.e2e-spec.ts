import { NoticeEntity } from 'apps/user-server/src/api/notice/entity/notice.entity';
import { SummaryNoticeEntity } from 'apps/user-server/src/api/notice/entity/summary-notice.entity';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { NoticeSeedHelper } from 'libs/testing/seed/notice/notice-seed.helper';
import * as request from 'supertest';

describe('Review (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const noticeSeedHelper = test.seedHelper(NoticeSeedHelper);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /notice/all', () => {
    it('Success - order by test', async () => {
      const [firstNotice, secondNotice, pinnedNotice, deletedNotice] =
        await noticeSeedHelper.seedAll([
          {
            pinnedAt: null,
            activatedAt: new Date(),
          },
          {
            pinnedAt: null,
            activatedAt: new Date(),
          },
          {
            pinnedAt: new Date(),
            activatedAt: new Date(),
          },
          {
            deletedAt: new Date(),
          },
        ]);

      const response = await request(test.getServer())
        .get('/notice/all')
        .expect(200);

      const noticeList: SummaryNoticeEntity[] = response.body.noticeList;

      expect(noticeList.length).toBe(3);
      expect(noticeList[0].idx).toBe(pinnedNotice.idx);
    });

    it('Success - notice field check', async () => {
      const [noticeSeed] = await noticeSeedHelper.seedAll([
        { activatedAt: new Date() },
      ]);

      const response = await request(test.getServer())
        .get('/notice/all')
        .expect(200);

      expect(response.body.noticeList.length).toBe(1);

      const notice: SummaryNoticeEntity = response.body.noticeList[0];

      expect(notice.idx).toBe(noticeSeed.idx);
      expect(notice.title).toBe(noticeSeed.title);
      expect(notice.pinnedAt).toBe(noticeSeed.pinnedAt);
    });

    it('Fail - invalid pageable', async () => {
      await request(test.getServer())
        .get('/notice/all')
        .query({
          page: 'null',
        })
        .expect(400);
    });

    it('Success - Delete notice test', async () => {
      // all deleted notice
      const [] = await noticeSeedHelper.seedAll([
        {
          pinnedAt: null,
          activatedAt: new Date(),
          deletedAt: new Date(),
        },
        {
          pinnedAt: null,
          activatedAt: new Date(),
          deletedAt: new Date(),
        },
        {
          pinnedAt: new Date(),
          activatedAt: new Date(),
          deletedAt: new Date(),
        },
        {
          deletedAt: new Date(),
        },
      ]);

      const response = await request(test.getServer())
        .get('/notice/all')
        .expect(200);

      const noticeList: SummaryNoticeEntity[] = response.body.noticeList;

      expect(noticeList.length).toBe(0);
    });
  });

  describe('GET /notice/:idx', () => {
    it('Success - field check', async () => {
      const noticeSeed = await noticeSeedHelper.seed({
        activatedAt: new Date(),
      });

      const response = await request(test.getServer())
        .get(`/notice/${noticeSeed.idx}`)
        .expect(200);

      const notice: NoticeEntity = response.body;

      expect(notice.idx).toBe(noticeSeed.idx);
      expect(notice.title).toBe(noticeSeed.title);
      expect(notice.contents).toBe(noticeSeed.contents);
      expect(notice.pinnedAt).toBe(noticeSeed.pinnedAt);
    });

    it('fail - Non-existent notice', async () => {
      const noticeIdx = 999;

      await request(test.getServer()).get(`/notice/${noticeIdx}`).expect(404);
    });

    it('fail - Invalid notice idx', async () => {
      const noticeIdx = null;

      await request(test.getServer()).get(`/notice/${noticeIdx}`).expect(400);
    });

    it('Attempt to get deleted notice', async () => {
      const deletedNotice = await noticeSeedHelper.seed({
        activatedAt: new Date(),
        deletedAt: new Date(),
      });

      await request(test.getServer())
        .get(`/notice/${deletedNotice.idx}`)
        .expect(404);
    });

    it('Attempt to get deactivated notice', async () => {
      const deactivatedNotice = await noticeSeedHelper.seed({
        activatedAt: null,
      });

      await request(test.getServer())
        .get(`/notice/${deactivatedNotice.idx}`)
        .expect(404);
    });
  });
});
