import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import { PrismaService } from '../../../../src/common/module/prisma/prisma.service';
import { PrismaSetting } from '../../setup/prisma.setup';
import { AppGlobalSetting } from '../../setup/app-global.setup';
import { LoginSetting, TestLoginUsers } from '../../setup/login-user.setup';

describe('Review (e2e)', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  const prismaSetting = PrismaSetting.setup();

  let loginUsers: TestLoginUsers;

  const noticeSeeds = [
    {
      idx: 1,
      title: '[공지사항] 점검 예정',
      contents: '점검 예정입니다...',
      activatedAt: new Date(),
      pinnedAt: null,
    },
    {
      idx: 2,
      title: '[공지사항] 점검 예정2',
      contents: '점검 예정입니다...2',
      activatedAt: new Date(),
      pinnedAt: new Date(),
    },
    {
      idx: 3,
      title: '[공지사항] 활성화되지 않은 공지사항',
      contents: '공지사항 내용',
      activatedAt: null,
      pinnedAt: null,
    },
    {
      idx: 4,
      title: '[공지사항] 활성화되지 않은 공지사항2',
      contents: '공지사항 내용',
      activatedAt: null,
      pinnedAt: null,
    },
    /**
     * 활성화 이후에 삭제된 공지사항
     */
    {
      idx: 5,
      title: '[공지사항] 삭제된 공지사항',
      contents: '공지사항 내용',
      activatedAt: null,
      pinnedAt: null,
      deletedAt: new Date(),
    },
  ] as const;

  beforeAll(async () => {
    for (const notice of noticeSeeds) {
      await prismaSetting.getPrisma().notice.upsert({
        where: {
          idx: notice.idx,
        },
        create: {
          title: notice.title,
          contents: notice.contents,
          activatedAt: notice.activatedAt,
          pinnedAt: notice.pinnedAt,
        },
        update: {
          title: notice.title,
          contents: notice.contents,
          activatedAt: notice.activatedAt,
          pinnedAt: notice.pinnedAt,
        },
      });
    }
  });

  beforeEach(async () => {
    await prismaSetting.BEGIN();

    appModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaSetting.getPrisma())
      .compile();
    app = appModule.createNestApplication();
    AppGlobalSetting.setup(app);
    await app.init();

    loginUsers = await LoginSetting.setup(loginUsers, app);
  });

  afterEach(async () => {
    prismaSetting.ROLLBACK();
    await appModule.close();
    await app.close();
  });

  describe('GET /notice/all', () => {
    it('Success', async () => {
      const response = await request(app.getHttpServer())
        .get('/notice/all')
        .expect(200);

      expect(response.body?.noticeList).toBeDefined();
      expect(Array.isArray(response.body?.noticeList)).toBeTruthy();
      expect(response.body?.noticeList.length).toBe(2);

      const pinnedNotice = noticeSeeds[1];

      expect(response.body?.noticeList[0].idx).toBe(pinnedNotice.idx);
      expect(response.body?.noticeList[0].title).toBe(pinnedNotice.title);
    });

    it('Fail - invalid pageable', async () => {
      await request(app.getHttpServer())
        .get('/notice/all')
        .query({
          page: 'null',
        })
        .expect(400);
    });

    it('Success - Delete notice test', async () => {
      await prismaSetting.getPrisma().notice.create({
        data: {
          title: '삭제된 공지사항',
          contents: '삭제된 공지사항',
          deletedAt: new Date(),
        },
      });

      const response = await request(app.getHttpServer())
        .get('/notice/all')
        .expect(200);

      expect(response.body?.noticeList).toBeDefined();
      expect(Array.isArray(response.body?.noticeList)).toBeTruthy();
      expect(response.body?.noticeList.length).toBe(2);
    });
  });

  describe('GET /notice/:idx', () => {
    it('Success', async () => {
      const notice = noticeSeeds[0];

      const response = await request(app.getHttpServer())
        .get(`/notice/${notice.idx}`)
        .expect(200);

      expect(response.body.idx).toBe(1);
      expect(response.body.title).toBe(notice.title);
      expect(response.body.contents).toBe(notice.contents);
    });

    it('Non-existent notice', async () => {
      const noticeIdx = 999;

      await request(app.getHttpServer())
        .get(`/notice/${noticeIdx}`)
        .expect(404);
    });

    it('Invalid notice idx', async () => {
      const noticeIdx = null;

      await request(app.getHttpServer())
        .get(`/notice/${noticeIdx}`)
        .expect(400);
    });

    it('Attempt to get deleted notice', async () => {
      const deletedNotice = noticeSeeds[4];

      await request(app.getHttpServer())
        .get(`/notice/${deletedNotice.idx}`)
        .expect(404);
    });

    it('Attempt to get deactivated notice', async () => {
      const deactivatedNotice = noticeSeeds[2];

      await request(app.getHttpServer())
        .get(`/notice/${deactivatedNotice.idx}`)
        .expect(404);
    });
  });
});
