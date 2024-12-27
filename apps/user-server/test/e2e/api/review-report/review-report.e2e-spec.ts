import * as request from 'supertest';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { ReportReviewDto } from 'apps/user-server/src/api/review-report/dto/report-review.dto';
import { ReviewEntity } from 'apps/user-server/src/api/review/entity/review.entity';
import { CultureContentSeedHelper, ReviewSeedHelper } from 'libs/testing';
import { REVIEW_REPORT_TYPE } from 'libs/common';

describe('Review Report(e2e)', () => {
  const test = TestHelper.create(AppModule);
  const contentSeedHelper = test.seedHelper(CultureContentSeedHelper);
  const reviewSeedHelper = test.seedHelper(ReviewSeedHelper);
  const reviewReportSeedHelper = test.seedHelper(ReviewSeedHelper);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('POST /review/:idx/report', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        contentIdx: content.idx,
      });

      const reportDto: ReportReviewDto = {
        typeIdx: REVIEW_REPORT_TYPE.UNRELATED_CONTENT,
      };

      await request(test.getServer())
        .post(`/review/${review.idx}/report`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(reportDto)
        .expect(201);
    });

    it('Invalid DTO - string type idx', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        contentIdx: content.idx,
      });

      const reportDto: ReportReviewDto = {
        typeIdx: REVIEW_REPORT_TYPE.UNRELATED_CONTENT,
      };

      await request(test.getServer())
        .post(`/review/${review.idx}/report`)
        .send({
          typeIdx: '1',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - null type idx', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        contentIdx: content.idx,
      });

      const reportDto = {
        typeIdx: null,
      };

      await request(test.getServer())
        .post(`/review/${review.idx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - undefined type idx', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        contentIdx: content.idx,
      });

      const reportDto = {
        typeIdx: undefined,
      };

      await request(test.getServer())
        .post(`/review/${review.idx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - review idx', async () => {
      const reviewIdx = null;
      const reportDto: ReportReviewDto = {
        typeIdx: REVIEW_REPORT_TYPE.COPYRIGHT_INFRINGEMENT,
      };
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Non-existent review', async () => {
      const reviewIdx = -9999;
      const reportDto: ReportReviewDto = {
        typeIdx: REVIEW_REPORT_TYPE.ETC,
      };
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('No token', async () => {
      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        contentIdx: content.idx,
      });

      const reportDto: ReportReviewDto = {
        typeIdx: REVIEW_REPORT_TYPE.ETC,
      };

      await request(test.getServer())
        .post(`/review/${review.idx}/report`)
        .send(reportDto)
        .expect(401);
    });

    it('Report the review of login user', async () => {
      const loginUser = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: loginUser.idx,
        contentIdx: content.idx,
      });

      const reportDto: ReportReviewDto = {
        typeIdx: REVIEW_REPORT_TYPE.ETC,
      };

      await request(test.getServer())
        .post(`/review/${review.idx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Report a review login user already reported', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        contentIdx: content.idx,
      });

      const reportDto: ReportReviewDto = {
        typeIdx: REVIEW_REPORT_TYPE.ETC,
      };

      await request(test.getServer())
        .post(`/review/${review.idx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(test.getServer())
        .post(`/review/${review.idx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(409);
    });

    it('Non-existent report type', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        contentIdx: content.idx,
      });

      const reportDto: ReportReviewDto = {
        typeIdx: 99999, // 존재하지 않는 타입
      };

      await request(test.getServer())
        .post(`/review/${review.idx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(500);
    });

    it('Select review test after reporting a review', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const [firstReview, secondReview] = await reviewSeedHelper.seedAll([
        {
          userIdx: test.getLoginUsers().user1.idx,
          contentIdx: content.idx,
        },
        {
          userIdx: test.getLoginUsers().user1.idx,
          contentIdx: content.idx,
        },
      ]);

      const firstGetReviewResponse = await request(test.getServer())
        .get(`/review/all`)
        .query({
          content: content.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      const reviewList: ReviewEntity[] = firstGetReviewResponse.body.reviewList;
      const reviewIdxList = reviewList.map((review) => review.idx);

      expect(reviewIdxList.includes(firstReview.idx)).toBe(true);
      expect(reviewIdxList.includes(secondReview.idx)).toBe(true);

      const reportDto: ReportReviewDto = {
        typeIdx: 1,
      };

      await request(test.getServer())
        .post(`/review/${firstReview.idx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      const secondGetReviewResponse = await request(test.getServer())
        .get(`/review/all`)
        .query({
          content: content.idx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      const secondReviewList: ReviewEntity[] =
        secondGetReviewResponse.body.reviewList;
      const secondReviewIdxList = secondReviewList.map((review) => review.idx);

      expect(secondReviewIdxList.includes(firstReview.idx)).toBe(false);
      expect(secondReviewIdxList.includes(secondReview.idx)).toBe(true);
    });

    it('Update first_reported_at Success', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const reviewSeed = await reviewSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        contentIdx: content.idx,
        firstReportedAt: null,
      });

      await request(test.getServer())
        .post(`/review/${reviewSeed.idx}/report`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          typeIdx: REVIEW_REPORT_TYPE.ETC,
        })
        .expect(201);

      const review = await test.getPrisma().review.findUniqueOrThrow({
        where: {
          idx: reviewSeed.idx,
        },
      });

      expect(review.firstReportedAt).not.toBeNull();
    });

    it('No Update first_reported_at Success', async () => {
      const loginUser = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        acceptedAt: new Date(),
      });

      const firstReportDate = new Date();
      firstReportDate.setDate(firstReportDate.getDate() - 3);

      const reviewSeed = await reviewSeedHelper.seed({
        userIdx: test.getLoginUsers().user1.idx,
        contentIdx: content.idx,
        firstReportedAt: firstReportDate,
      });

      await request(test.getServer())
        .post(`/review/${reviewSeed.idx}/report`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          typeIdx: REVIEW_REPORT_TYPE.ETC,
        })
        .expect(201);

      const review = await test.getPrisma().review.findUniqueOrThrow({
        where: {
          idx: reviewSeed.idx,
        },
      });

      expect(review.firstReportedAt).toEqual(firstReportDate);
    });
  });
});
