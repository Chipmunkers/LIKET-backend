import * as request from 'supertest';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import {
  CultureContentSeedHelper,
  LiketSeedHelper,
  ReviewSeedHelper,
} from 'libs/testing';
import { CultureContentOutput } from 'libs/testing/seed/culture-content/type/culture-content.output';
import { ReviewOutput } from 'libs/testing/seed/review/type/review.output';
import { SummaryLiketEntity } from 'apps/user-server/src/api/liket/entity/summary-liket.entity';

describe('Liket (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const contentSeedHelper = test.seedHelper(CultureContentSeedHelper);
  const reviewSeedHelper = test.seedHelper(ReviewSeedHelper);
  const liketSeedHelper = test.seedHelper(LiketSeedHelper);

  let content: CultureContentOutput;
  let review: ReviewOutput;
  let reviewOfOtherUser: ReviewOutput;

  beforeEach(async () => {
    await test.init();

    content = await contentSeedHelper.seed({
      userIdx: test.getLoginUsers().user1.idx,
      acceptedAt: new Date(),
    });

    review = await reviewSeedHelper.seed({
      userIdx: test.getLoginUsers().user2.idx,
      contentIdx: content.idx,
    });

    reviewOfOtherUser = await reviewSeedHelper.seed({
      userIdx: test.getLoginUsers().not(review.userIdx).idx,
      contentIdx: content.idx,
    });
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /liket/:idx', () => {
    it('Success - no token', async () => {
      const liket = await liketSeedHelper.seed({
        reviewIdx: review.idx,
      });

      const response = await request(test.getServer())
        .get(`/liket/${liket.idx}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(liket.idx);
    });

    it('Success - login', async () => {
      const liket = await liketSeedHelper.seed({
        reviewIdx: review.idx,
      });
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get(`/liket/${liket.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.idx).toBe(liket.idx);
    });

    it('Non-existent liket', async () => {
      const liketIdx = -999999;
      await request(test.getServer()).get(`/liket/${liketIdx}`).expect(404);
    });

    it('Invalid path parameter', async () => {
      const liketIdx = 'invalid';
      await request(test.getServer()).get(`/liket/${liketIdx}`).expect(400);
    });
  });

  describe('POST /review/:idx/liket', () => {
    it('Success', async () => {
      const reviewIdx = review.idx;
      const loginUser = test.getLoginUsers().of(review.userIdx);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(successLiketData)
        .expect(200);
    });

    it('Success - without textShape', async () => {
      const reviewIdx = review.idx;
      const loginUser = test.getLoginUsers().of(review.userIdx);

      const { textShape, ...liketDataWithoutTextShape } = successLiketData;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(liketDataWithoutTextShape) // text shape field can be undefined
        .expect(200);
    });

    it('No token', async () => {
      const reviewIdx = review.idx;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${null}`)
        .send(successLiketData)
        .expect(401);
    });

    it('Invalid dto - ImgShapes', async () => {
      const reviewIdx = review.idx;
      const loginUser = test.getLoginUsers().of(review.userIdx);
      const { imgShapes, ...liketDataWithoutImgShapes } = successLiketData;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          ...liketDataWithoutImgShapes,
          imgShapes: '', // imgShapes field must be an array which has object including code, stickerNumber, width, height, x and y field
        })
        .expect(400);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          ...liketDataWithoutImgShapes,
          imgShapes: [
            {
              stickerNumber: 1,
              width: 164.90748039256275,
              height: 109.52810264879164,
              x: 108,
              y: 209, // imgShapes field must have code field
            },
          ],
        })
        .expect(400);
    });

    it('Invalid dto - textShape', async () => {
      const reviewIdx = review.idx;
      const loginUser = test.getLoginUsers().of(review.userIdx);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          ...successLiketData,
          textShape: '', // textShape field must be json object which has code, fill, text, x and y
        })
        .expect(400);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          ...successLiketData,
          textShape: {
            code: 9,
            fill: '#f5d949',
            text: '별이 빛나는 밤에',
            x: 444, // textShape field must have y field
          },
        })
        .expect(400);
    });

    it('Invalid dto - bgImgInfo', async () => {
      const reviewIdx = review.idx;
      const loginUser = test.getLoginUsers().of(review.userIdx);

      const { bgImgInfo, ...liketDataWithoutBgImgInfo } = successLiketData;
      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          ...liketDataWithoutBgImgInfo, // body must have BgImgInfo field
        })
        .expect(400);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          ...liketDataWithoutBgImgInfo,
          bgImgInfo: '', // bgImgInfo field must be an object including angle, width, height, offsetX, offsetY, x and y
        })
        .expect(400);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          ...liketDataWithoutBgImgInfo,
          bgImgInfo: [
            {
              width: 109.52810264879164,
              height: 109.52810264879164,
              offsetX: 82.44220158804448,
              offsetY: 54.75638762191013,
              x: 108,
              y: 209, // bgImgInfo field must have angle field
            },
          ],
        })
        .expect(400);
    });

    it('Invalid dto - size', async () => {
      const reviewIdx = review.idx;
      const loginUser = test.getLoginUsers().of(review.userIdx);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          ...successLiketData,
          size: 4, // size must be between 1 ~ 3, inclusive
        })
        .expect(400);
    });

    it('Invalid dto - description', async () => {
      const reviewIdx = review.idx;
      const loginUser = test.getLoginUsers().of(review.userIdx);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          ...successLiketData,
          description: '', // description must be between 1 ~ 42, inclusive
        })
        .expect(400);
    });

    it('Non-existent review', async () => {
      const reviewIdx = -99999;
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(successLiketData)
        .expect(404);
    });

    it('Invalid path parameter', async () => {
      const reviewIdx = 'invalid';
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(successLiketData)
        .expect(400);
    });

    it('Attempt to create liket for review written by other user', async () => {
      const reviewIdx = review.idx;
      const loginUser = test.getLoginUsers().not(review.userIdx);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(successLiketData)
        .expect(403);
    });

    it('Attempt to create liket in a situation that a liket for review already exist', async () => {
      const reviewIdx = review.idx;
      const loginUser = test.getLoginUsers().of(review.userIdx);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(successLiketData)
        .expect(200);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(successLiketData)
        .expect(409);
    });

    it('Attempt to create liket for deleted review', async () => {
      const loginUser = test.getLoginUsers().user1;

      const deletedReview = await reviewSeedHelper.seed({
        contentIdx: content.idx,
        userIdx: loginUser.idx,
        deletedAt: new Date(), // deleted review
      });

      await request(test.getServer())
        .delete(`/review/${deletedReview.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);

      await request(test.getServer())
        .post(`/review/${deletedReview.idx}/liket`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(successLiketData)
        .expect(404);
    });
  });

  describe('GET /liket/all', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().of(review.userIdx);

      await liketSeedHelper.seedAll([
        {
          reviewIdx: review.idx,
        },
        {
          reviewIdx: reviewOfOtherUser.idx,
        },
      ]);

      const response = await request(test.getServer())
        .get('/liket/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          user: loginUser.idx,
        })
        .expect(200);

      const liketList: SummaryLiketEntity[] = response.body.liketList;

      expect(Array.isArray(liketList)).toBeTruthy();
      expect(liketList.length).toBe(1);
    });

    it('Attempt to see liket list created by other user', async () => {
      const loginUser = test.getLoginUsers().user2;
      await request(test.getServer())
        .get('/liket/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          user: 1,
          orderby: 'time',
          order: 'desc',
        })
        .expect(403);
    });
  });

  describe('DELETE /liket/:idx', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().of(review.userIdx);
      const liket = await liketSeedHelper.seed({
        reviewIdx: review.idx,
      });

      await request(test.getServer())
        .delete(`/liket/${liket.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Attempt to delete liket created by other user', async () => {
      const loginUser = test.getLoginUsers().not(review.userIdx);
      const liket = await liketSeedHelper.seed({
        reviewIdx: review.idx,
      });

      await request(test.getServer())
        .delete(`/liket/${liket.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Non-existent liket', async () => {
      const liketIdx = -9999999;
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .delete(`/liket/${liketIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('Invalid path parameter', async () => {
      const liketIdx = 'invalid';
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .delete(`/liket/${liketIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });
  });
});

const successLiketData = {
  cardImgPath: '/liket/img_000001.png',
  size: 1,
  textShape: {
    fill: '#f5d949',
    text: '별이 빛나는 밤에',
    x: 444,
    y: 555,
  },
  bgImgPath: '/liket/bg/img_000001.png',
  bgImgInfo: {
    rotation: -304.2448570172177,
    width: 109.52810264879164,
    height: 109.52810264879164,
    offsetX: 82.44220158804448,
    offsetY: 54.75638762191013,
    x: 108,
    y: 209,
  },
  imgShapes: [
    {
      code: 9,
      stickerNumber: 1,
      rotation: 3,
      width: 164.90748039256275,
      height: 109.52810264879164,
      x: 108,
      y: 209,
    },
  ],
  description: '너무 좋았던 팝업 스토어',
};
