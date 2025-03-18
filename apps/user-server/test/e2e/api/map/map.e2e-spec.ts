import * as request from 'supertest';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { CultureContentSeedHelper } from 'libs/testing';
import { MapContentEntity } from 'apps/user-server/src/api/map/entity/map-content.entity';
import { STYLE } from 'libs/core/tag-root/style/constant/style';
import { GENRE } from 'libs/core/tag-root/genre/constant/genre';
import { AGE } from 'libs/core/tag-root/age/constant/age';

describe('Map (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const contentSeedHelper = test.seedHelper(CultureContentSeedHelper);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /map/culture/content/all', () => {
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

    it('Success: test with not open contents', async () => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const oneMonthAfter = new Date();
      oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);

      const [firstContents, secondContents, thirdContents] =
        await contentSeedHelper.seedAll([
          {
            userIdx: test.getLoginUsers().user1.idx,
            acceptedAt: new Date(),
            startDate: oneMonthAgo,
            endDate: oneMonthAfter,
            location: {
              positionX: 127.5,
              positionY: 29.5,
            },
          },
          {
            userIdx: test.getLoginUsers().user1.idx,
            acceptedAt: new Date(),
            startDate: oneMonthAgo,
            endDate: null,
            location: {
              positionX: 127.5,
              positionY: 29.5,
            },
          },
          {
            // not open contents
            userIdx: test.getLoginUsers().user1.idx,
            acceptedAt: new Date(),
            startDate: oneMonthAfter,
            endDate: null,
            location: {
              positionX: 127.5,
              positionY: 29.5,
            },
          },
        ]);

      const response = await request(test.getServer())
        .get(`/map/culture-content/all`)
        .query({
          'top-x': 127,
          'top-y': 30,
          'bottom-x': 128,
          'bottom-y': 29,
        })
        .expect(200);

      const { contentList }: { contentList: MapContentEntity[] } =
        response.body;

      expect(contentList.length).toBe(2);
      expect(
        contentList
          .map((content: MapContentEntity) => content.idx)
          .includes(firstContents.idx),
      );
      expect(
        contentList
          .map((content: MapContentEntity) => content.idx)
          .includes(secondContents.idx),
      );
    });

    it('Success: coordinate round test X: (127 ~ 128), Y: (35 ~ 36)', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const [firstContent, secondContent] = await contentSeedHelper.seedAll([
        {
          userIdx: contentAuthor.idx,
          acceptedAt: new Date(),
          location: {
            positionX: 127.5,
            positionY: 35.5,
          },
        },
        {
          userIdx: contentAuthor.idx,
          acceptedAt: new Date(),
          location: {
            positionX: 127.2,
            positionY: 35.8,
          },
        },
        {
          userIdx: contentAuthor.idx,
          acceptedAt: new Date(),
          location: {
            positionX: 127.4,
            positionY: 34.5, // out
          },
        },
        {
          userIdx: contentAuthor.idx,
          acceptedAt: new Date(),
          location: {
            positionX: 127.4,
            positionY: 36.1, // out
          },
        },
        {
          userIdx: contentAuthor.idx,
          acceptedAt: new Date(),
          location: {
            positionX: 128.2, // out
            positionY: 35.5,
          },
        },
        {
          userIdx: contentAuthor.idx,
          acceptedAt: new Date(),
          location: {
            positionX: 126.8, // out
            positionY: 35.5,
          },
        },
      ]);

      const response = await request(test.getServer())
        .get(`/map/culture-content/all`)
        .query({
          'top-x': 127,
          'top-y': 36,
          'bottom-x': 128,
          'bottom-y': 35,
        })
        .expect(200);

      const contentList: MapContentEntity[] = response.body.contentList;

      expect(Array.isArray(contentList)).toBeTruthy();

      expect(contentList.map(({ idx }) => idx).sort()).toStrictEqual(
        [firstContent.idx, secondContent.idx].sort(),
      );
    });

    it('Success: accepted culture content filter test', async () => {
      const contentAuthor = test.getLoginUsers().user1;

      const [notAcceptedContent, acceptedContent] =
        await contentSeedHelper.seedAll([
          {
            userIdx: contentAuthor.idx,
            acceptedAt: null,
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
          },
          {
            userIdx: contentAuthor.idx,
            acceptedAt: new Date(),
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
          },
        ]);

      const response = await request(test.getServer())
        .get(`/map/culture-content/all`)
        .query({
          'top-x': 127,
          'top-y': 36,
          'bottom-x': 128,
          'bottom-y': 35,
        })
        .expect(200);

      const { contentList }: { contentList: MapContentEntity[] } =
        response.body;

      expect(contentList.map(({ idx }) => idx).sort()).toStrictEqual(
        [acceptedContent.idx].sort(),
      );
    });

    it('Success: culture content style filter test', async () => {
      const contentAuthor = test.getLoginUsers().user1;

      const [cuteContent, familyContent, artisticContent] =
        await contentSeedHelper.seedAll([
          {
            userIdx: contentAuthor.idx,
            acceptedAt: new Date(),
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
            styleIdxList: [STYLE.CUTE],
          },
          {
            userIdx: contentAuthor.idx,
            acceptedAt: new Date(),
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
            styleIdxList: [STYLE.FAMILY],
          },
          {
            userIdx: contentAuthor.idx,
            acceptedAt: new Date(),
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
            styleIdxList: [STYLE.ARTISTIC],
          },
        ]);

      const response = await request(test.getServer())
        .get(`/map/culture-content/all`)
        .query({
          'top-x': 127,
          'top-y': 36,
          'bottom-x': 128,
          'bottom-y': 35,
          styles: [STYLE.CUTE, STYLE.ARTISTIC],
        })
        .expect(200);

      const { contentList }: { contentList: MapContentEntity[] } =
        response.body;

      expect(contentList.map(({ idx }) => idx).sort()).toStrictEqual(
        [cuteContent.idx, artisticContent.idx].sort(),
      );
    });

    it('Success: culture content genre filter test', async () => {
      const contentAuthor = test.getLoginUsers().user1;

      const [popupContent, festivalContent, exhibitionContent] =
        await contentSeedHelper.seedAll([
          {
            userIdx: contentAuthor.idx,
            acceptedAt: new Date(),
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
            genreIdx: GENRE.POPUP_STORE,
          },
          {
            userIdx: contentAuthor.idx,
            acceptedAt: new Date(),
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
            genreIdx: GENRE.FESTIVAL,
          },
          {
            userIdx: contentAuthor.idx,
            acceptedAt: new Date(),
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
            genreIdx: GENRE.EXHIBITION,
          },
        ]);

      const response = await request(test.getServer())
        .get(`/map/culture-content/all`)
        .query({
          'top-x': 127,
          'top-y': 36,
          'bottom-x': 128,
          'bottom-y': 35,
          genre: GENRE.POPUP_STORE,
        })
        .expect(200);

      const { contentList }: { contentList: MapContentEntity[] } =
        response.body;

      expect(contentList.map(({ idx }) => idx).sort()).toStrictEqual(
        [popupContent.idx].sort(),
      );
    });

    it('Success: culture content genre filter test', async () => {
      const contentAuthor = test.getLoginUsers().user1;

      const [childrenContent, teensContent, thirtiesContent] =
        await contentSeedHelper.seedAll([
          {
            userIdx: contentAuthor.idx,
            acceptedAt: new Date(),
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
            ageIdx: AGE.CHILDREN,
          },
          {
            userIdx: contentAuthor.idx,
            acceptedAt: new Date(),
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
            ageIdx: AGE.TEENS,
          },
          {
            userIdx: contentAuthor.idx,
            acceptedAt: new Date(),
            location: {
              positionX: 127.2,
              positionY: 35.8,
            },
            ageIdx: AGE.THIRTIES,
          },
        ]);

      const response = await request(test.getServer())
        .get(`/map/culture-content/all`)
        .query({
          'top-x': 127,
          'top-y': 36,
          'bottom-x': 128,
          'bottom-y': 35,
          age: AGE.CHILDREN,
        })
        .expect(200);

      const { contentList }: { contentList: MapContentEntity[] } =
        response.body;

      expect(contentList.map(({ idx }) => idx).sort()).toStrictEqual(
        [childrenContent.idx].sort(),
      );
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
