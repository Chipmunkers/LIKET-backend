import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { InquirySeedHelper } from 'libs/testing';
import * as request from 'supertest';

describe('Inquiry (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const inquirySeedHelper = test.seedHelper(InquirySeedHelper);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /inquiry/all', () => {
    it('Success - user1', async () => {
      const loginUser = test.getLoginUsers().user2;

      const [firstInquiry, secondInquiry, thirdInquiry] =
        await inquirySeedHelper.seedAll([
          { userIdx: loginUser.idx },
          { userIdx: loginUser.idx },
          { userIdx: loginUser.idx },
          { userIdx: loginUser.idx, deletedAt: new Date() },
        ]);

      const response = await request(test.getServer())
        .get('/inquiry/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.inquiryList).toBeDefined();
      expect(Array.isArray(response.body.inquiryList)).toBe(true);
      expect(response.body.inquiryList.length).toBe(3);
      expect(response.body.inquiryList[0].idx).toBe(thirdInquiry.idx);
      expect(response.body.inquiryList[1].idx).toBe(secondInquiry.idx);
      expect(response.body.inquiryList[2].idx).toBe(firstInquiry.idx);
    });

    it('Success - user2', async () => {
      const otherUser = test.getLoginUsers().user1;
      const loginUser = test.getLoginUsers().user2;

      await inquirySeedHelper.seedAll([
        { userIdx: otherUser.idx },
        { userIdx: otherUser.idx },
      ]);

      const response = await request(test.getServer())
        .get('/inquiry/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.inquiryList).toBeDefined();
      expect(Array.isArray(response.body.inquiryList)).toBe(true);
      expect(response.body.inquiryList.length).toBe(0);
    });

    it('No token', async () => {
      await request(test.getServer())
        .get('/inquiry/all')
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Invalid DTO - page', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/inquiry/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          page: 'invalid', // Invalid
        })
        .expect(400);
    });
  });

  describe('GET /inquiry/:idx', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      const inquiry = await inquirySeedHelper.seed({
        userIdx: loginUser.idx,
      });

      const response = await request(test.getServer())
        .get(`/inquiry/${inquiry.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.idx).toBeDefined();
      expect(response.body.idx).toBe(inquiry.idx);
      expect(response.body.title).toBe(inquiry.title);
      expect(response.body.contents).toBe(inquiry.contents);
    });

    it('Non-existent inquiry', async () => {
      const loginUser = test.getLoginUsers().user1;
      const idx = -9999; // Non-existent inquiry

      await request(test.getServer())
        .get(`/inquiry/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('No token', async () => {
      const idx = 1;

      await request(test.getServer())
        .get(`/inquiry/${idx}`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Permission denied - non author user', async () => {
      const otherUser = test.getLoginUsers().user1;
      const loginUser = test.getLoginUsers().user2;

      const inquiry = await inquirySeedHelper.seed({
        userIdx: otherUser.idx,
      });

      await request(test.getServer())
        .get(`/inquiry/${inquiry.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });
  });

  describe('POST /inquiry', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        contents: 'test-contents',
        imgList: [],
        typeIdx: 1,
      };

      const response = await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(200);

      expect(response.body?.idx).toBeDefined();
    });

    it('No token', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        contents: 'test-contents',
        imgList: [],
        typeIdx: 1,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${null}`)
        .send(createDto)
        .expect(401);
    });

    it('Invalid DTO - title', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        contents: 'test-contents',
        imgList: [],
        typeIdx: 1,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(400);
    });

    it('Invalid DTO - contents', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        imgList: [],
        typeIdx: 1,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(400);
    });

    it('Invalid DTO - imgList', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        typeIdx: 1,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(400);
    });

    it('Invalid DTO - imgList', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        contents: 'test-contents',
        typeIdx: 1,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(400);
    });

    it('Invalid DTO - typeIdx', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        contents: 'test-contents',
        imgList: [],
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(400);
    });

    it('Invalid DTO - no typeIdx', async () => {
      const loginUser = test.getLoginUsers().user1;
      const createDto = {
        title: 'title',
        contents: 'test-contents',
        imgList: [],
        typeIdx: 999,
      };

      await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(500);
    });
  });

  describe('DELETE /inquiry/:idx', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      // 문의 생성
      const response = await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          title: 'title',
          contents: 'test-contents',
          imgList: [],
          typeIdx: 1,
        })
        .expect(200);
      expect(response.body?.idx).toBeDefined();
      const createdInquiry = response.body;

      await request(test.getServer())
        .delete(`/inquiry/${createdInquiry.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('No token', async () => {
      await request(test.getServer())
        .delete(`/inquiry/1`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Permission denied - non author user', async () => {
      const otherUser = test.getLoginUsers().user1;
      const loginUser = test.getLoginUsers().user2;

      const inquiry = await inquirySeedHelper.seed({
        userIdx: otherUser.idx,
      });

      await request(test.getServer())
        .delete(`/inquiry/${inquiry.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Non-existent inquiry', async () => {
      const loginUser = test.getLoginUsers().user2;
      const idx = -999999; // Non-existent inquiry

      await request(test.getServer())
        .delete(`/inquiry/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('Delete twice', async () => {
      const loginUser = test.getLoginUsers().user1;

      // 문의 생성
      const response = await request(test.getServer())
        .post('/inquiry')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          title: 'title',
          contents: 'test-contents',
          imgList: [],
          typeIdx: 1,
        })
        .expect(200);
      expect(response.body?.idx).toBeDefined();
      const createdInquiry = response.body;

      await request(test.getServer())
        .delete(`/inquiry/${createdInquiry.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(test.getServer())
        .delete(`/inquiry/${createdInquiry.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });
  });
});
