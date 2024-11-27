import * as request from 'supertest';
import { ContentViewService } from '../../../../src/api/culture-content/content-view.service';
import { TestHelper } from '../../setup/test.helper';
import { PrismaProvider } from '../../../../../../libs/modules/src';

describe('Culture Content View (e2e)', () => {
  const test = TestHelper.create();

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
      const response = await request(test.getServer())
        .get('/culture-content/1')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
    });

    it('Non-existent content', async () => {
      await request(test.getServer())
        .get('/culture-content/9999999')
        .expect(404);
    });

    it('Not accepted content - author', async () => {
      const idx = 2;
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(idx);
    });

    it('Not accepted content - no author', async () => {
      const idx = 2;
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Not accepted content - no token', async () => {
      const idx = 2;

      await request(test.getServer())
        .get(`/culture-content/${idx}`)
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
      const idx = 1;

      const content = await test
        .get(PrismaProvider)
        .cultureContent.findUniqueOrThrow({
          where: {
            idx,
          },
        });

      const response = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
      expect(response.body.viewCount).toBe(content.viewCount);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const secondResponse = await request(test.getServer())
        .get('/culture-content/1')
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(1);
      expect(secondResponse.body.viewCount).toBe(content.viewCount);
    });

    it('Increase view count - login', async () => {
      const loginUser = test.getLoginUsers().user2;
      const idx = 1;

      const content = await test
        .get(PrismaProvider)
        .cultureContent.findUniqueOrThrow({
          where: {
            idx,
          },
        });

      const response = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
      expect(response.body.viewCount).toBe(content.viewCount);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const secondResponse = await request(test.getServer())
        .get('/culture-content/1')
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(1);
      expect(secondResponse.body.viewCount).toBe(content.viewCount + 1);
    });

    it('Increase view count - multiple users', async () => {
      const loginUser = test.getLoginUsers().user2;
      const idx = 1;

      const content = await test
        .get(PrismaProvider)
        .cultureContent.findUniqueOrThrow({
          where: { idx },
        });

      const response = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
      expect(response.body.viewCount).toBe(content.viewCount);

      const loginUser2 = test.getLoginUsers().user1;
      const secondResponse = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser2.accessToken}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(1);
      expect(secondResponse.body.viewCount).toBe(content.viewCount);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const lastResponse = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .expect(200);

      expect(lastResponse.body).toBeDefined();
      expect(lastResponse.body.idx).toBe(1);
      expect(lastResponse.body.viewCount).toBe(content.viewCount + 2);
    });

    it('Increase view count - one user', async () => {
      const loginUser = test.getLoginUsers().user2;
      const idx = 1;

      const content = await test
        .get(PrismaProvider)
        .cultureContent.findUniqueOrThrow({ where: { idx } });

      const response = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
      expect(response.body.viewCount).toBe(content.viewCount);

      const secondResponse = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(1);
      expect(secondResponse.body.viewCount).toBe(content.viewCount);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const lastResponse = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .expect(200);

      expect(lastResponse.body).toBeDefined();
      expect(lastResponse.body.idx).toBe(1);
      expect(lastResponse.body.viewCount).toBe(content.viewCount + 1);
    });

    it('Increase view count - after cool down', async () => {
      const loginUser = test.getLoginUsers().user2;
      const idx = 1;

      const content = await test
        .get(PrismaProvider)
        .cultureContent.findUniqueOrThrow({ where: { idx } });

      const response = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(1);
      expect(response.body.viewCount).toBe(content.viewCount);

      const secondResponse = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(secondResponse.body).toBeDefined();
      expect(secondResponse.body.idx).toBe(1);
      expect(secondResponse.body.viewCount).toBe(content.viewCount);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const thirdResponse = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .expect(200);

      expect(thirdResponse.body).toBeDefined();
      expect(thirdResponse.body.idx).toBe(1);
      expect(thirdResponse.body.viewCount).toBe(content.viewCount + 1);

      jest.advanceTimersByTime(ContentViewService.VIEW_COOL_DOWN);

      const fourthResponse = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(fourthResponse.body).toBeDefined();
      expect(fourthResponse.body.idx).toBe(1);
      expect(fourthResponse.body.viewCount).toBe(content.viewCount + 1);

      jest.advanceTimersByTime(ContentViewService.UPDATE_TIME);

      const lastResponse = await request(test.getServer())
        .get(`/culture-content/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(lastResponse.body).toBeDefined();
      expect(lastResponse.body.idx).toBe(1);
      expect(lastResponse.body.viewCount).toBe(content.viewCount + 2);
    });
  });
});
