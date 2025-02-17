import * as request from 'supertest';
import { PrismaProvider } from 'libs/modules';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { ContentViewService } from 'apps/user-server/src/api/culture-content/content-view.service';
import { CultureContentSeedHelper } from 'libs/testing';
import { AGE } from 'libs/core/tag-root/age/constant/age';
import { STYLE } from 'libs/core/tag-root/style/constant/style';
import { ContentEntity } from 'apps/user-server/src/api/culture-content/entity/content.entity';

describe('Culture Content View (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const contentSeedHelper = test.seedHelper(CultureContentSeedHelper);

  beforeEach(async () => {
    await test.init();

    jest.useFakeTimers({
      advanceTimers: true,
    });
  });

  afterEach(async () => {
    await test.destroy();

    jest.useRealTimers();
  });

  afterAll(async () => {
    const keys = Object.keys(ContentViewService.EVENT_ID_MAP);

    for (const key of keys) {
      clearTimeout(ContentViewService.EVENT_ID_MAP[key]);
    }

    jest.clearAllTimers();
  });

  describe('GET /culture-content/:idx', () => {
    it('Success with no token', async () => {
      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const response = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(content.idx);
    });

    it('Non-existent content', async () => {
      await request(test.getServer())
        .get('/culture-content/9999999')
        .expect(404);
    });

    it('Correct field test', async () => {
      const loginUser = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        acceptedAt: new Date(),
        userIdx: loginUser.idx,
      });

      const response = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .expect(200);

      const responseContent: ContentEntity = response.body;

      expect(responseContent.idx).toBe(content.idx);
      expect(responseContent.acceptedAt).toBe(
        content.acceptedAt?.toISOString(),
      );
      expect(responseContent.endDate).toBe(content.endDate);
      expect(responseContent.title).toBe(content.title);
      expect(responseContent.description).toBe(content.description);
      expect(responseContent.isFee).toBe(content.isFee);
      expect(responseContent.isParking).toBe(content.isParking);
      expect(responseContent.isReservation).toBe(content.isReservation);
      expect(responseContent.isPet).toBe(content.isPet);
      expect(responseContent.location.region1Depth).toBe(
        content.location.region1Depth,
      );
      expect(responseContent.location.region2Depth).toBe(
        content.location.region2Depth,
      );
      expect(responseContent.location.bCode).toBe(content.location.bCode);
      expect(responseContent.location.hCode).toBe(content.location.hCode);
      expect(responseContent.location.positionX).toBe(
        content.location.positionX,
      );
      expect(responseContent.location.positionY).toBe(
        content.location.positionY,
      );
      expect(responseContent.location.detailAddress).toBe(
        content.location.detailAddress,
      );
      expect(responseContent.imgList.sort()).toStrictEqual(
        content.imgList.sort(),
      );
      expect(responseContent.openTime).toBe(content.openTime);
      expect(responseContent.style.map(({ idx }) => idx).sort()).toStrictEqual(
        content.styleIdxList.sort(),
      );
      expect(responseContent.age.idx).toBe(content.ageIdx);
      expect(responseContent.genre.idx).toBe(content.genreIdx);
    });

    it('Not accepted content - author', async () => {
      const notAcceptedContent = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: null,
      });
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get(`/culture-content/${notAcceptedContent.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(notAcceptedContent.idx);
    });

    it('Not accepted content - no author', async () => {
      const loginUser = test.getLoginUsers().user2;

      const notAcceptedContent = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().not(loginUser.idx).idx,
        acceptedAt: null,
      });

      await request(test.getServer())
        .get(`/culture-content/${notAcceptedContent.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Not accepted content - no token', async () => {
      const notAcceptedContent = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: null,
      });

      await request(test.getServer())
        .get(`/culture-content/${notAcceptedContent.idx}`)
        .expect(403);
    });

    it('Deleted content - author', async () => {
      const idx = 3;
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('Deleted content - no author', async () => {
      const idx = 3;
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('Increase view count - no login', async () => {
      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const response = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(content.idx);
      expect(response.body.viewCount).toBe(content.viewCount);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const secondResponse = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(content.idx);
      expect(secondResponse.body.viewCount).toBe(content.viewCount);
    });

    it('Increase view count - login', async () => {
      const loginUser = test.getLoginUsers().user2;
      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const response = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(content.idx);
      expect(response.body.viewCount).toBe(content.viewCount);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const secondResponse = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(content.idx);
      expect(secondResponse.body.viewCount).toBe(content.viewCount + 1);
    });

    it('Increase view count - multiple users', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const response = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(content.idx);
      expect(response.body.viewCount).toBe(content.viewCount);

      const loginUser2 = test.getLoginUsers().user1;
      const secondResponse = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser2.accessToken}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(content.idx);
      expect(secondResponse.body.viewCount).toBe(content.viewCount);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const lastResponse = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .expect(200);

      expect(lastResponse.body).toBeDefined();
      expect(lastResponse.body.idx).toBe(content.idx);
      expect(lastResponse.body.viewCount).toBe(content.viewCount + 2);
    });

    it('Increase view count - one user', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const response = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(content.idx);
      expect(response.body.viewCount).toBe(content.viewCount);

      const secondResponse = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(content.idx);
      expect(secondResponse.body.viewCount).toBe(content.viewCount);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const lastResponse = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .expect(200);

      expect(lastResponse.body).toBeDefined();
      expect(lastResponse.body.idx).toBe(content.idx);
      expect(lastResponse.body.viewCount).toBe(content.viewCount + 1);
    });

    it('Increase view count - after cool down', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const response = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(content.idx);
      expect(response.body.viewCount).toBe(content.viewCount);

      const secondResponse = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(content.idx);
      expect(secondResponse.body.viewCount).toBe(content.viewCount);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const thirdResponse = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .expect(200);

      expect(thirdResponse.body).toBeDefined();
      expect(thirdResponse.body.idx).toBe(content.idx);
      expect(thirdResponse.body.viewCount).toBe(content.viewCount + 1);

      jest.advanceTimersByTime(ContentViewService.VIEW_COOL_DOWN);

      const fourthResponse = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(fourthResponse.body).toBeDefined();
      expect(fourthResponse.body.idx).toBe(content.idx);
      expect(fourthResponse.body.viewCount).toBe(content.viewCount + 1);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const lastResponse = await request(test.getServer())
        .get(`/culture-content/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(lastResponse.body).toBeDefined();
      expect(lastResponse.body.idx).toBe(content.idx);
      expect(lastResponse.body.viewCount).toBe(content.viewCount + 2);
    });
  });
});
