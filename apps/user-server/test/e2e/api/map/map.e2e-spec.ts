import * as request from 'supertest';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { CultureContentSeedHelper } from 'libs/testing';
import { MapContentEntity } from 'apps/user-server/src/api/map/entity/map-content.entity';

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
    // TODO: 범위 밖에 있는 컨텐츠는 안 보이는지 테스트 케이스 필요

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
