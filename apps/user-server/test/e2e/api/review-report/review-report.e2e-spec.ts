import * as request from 'supertest';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { ReportReviewDto } from 'apps/user-server/src/api/review-report/dto/report-review.dto';
import { ReviewEntity } from 'apps/user-server/src/api/review/entity/review.entity';

describe('Review Report(e2e)', () => {
  const test = TestHelper.create(AppModule);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('POST /review/:idx/report', () => {
    it('Success', async () => {
      const reviewIdx = 1;
      const reportDto: ReportReviewDto = {
        typeIdx: 1,
      };
      const loginUser = test.getLoginUsers().user2; // 1번 2번 리뷰 모두 user 1에 의해 작성된 리뷰들임

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(reportDto)
        .expect(201);
    });

    it('Invalid DTO - string type idx', async () => {
      const reviewIdx = 1;
      const reportDto = {
        typeIdx: '1',
      };
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - null type idx', async () => {
      const reviewIdx = 1;
      const reportDto = {
        typeIdx: null,
      };
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - undefined type idx', async () => {
      const reviewIdx = 1;
      const reportDto = {
        typeIdx: undefined,
      };
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - review idx', async () => {
      const reviewIdx = null;
      const reportDto: ReportReviewDto = {
        typeIdx: 2,
      };
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Non-existent review', async () => {
      const reviewIdx = 9999;
      const reportDto: ReportReviewDto = {
        typeIdx: 2,
      };
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('No token', async () => {
      const reviewIdx = 1;
      const reportDto: ReportReviewDto = {
        typeIdx: 2,
      };

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .expect(401);
    });

    it('Report the review of login user', async () => {
      const reviewIdx = 1;
      const reportDto: ReportReviewDto = {
        typeIdx: 2,
      };
      const loginUser = test.getLoginUsers().user1; // 1번 사용자는 모든 리뷰의 작성자임

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Report a review login user already reported', async () => {
      const reviewIdx = 1;
      const reportDto: ReportReviewDto = {
        typeIdx: 2,
      };
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(409);
    });

    it('Non-existent report type', async () => {
      const reviewIdx = 1;
      const reportDto: ReportReviewDto = {
        typeIdx: 99999, // 존재하지 않는 타입
      };
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(500);
    });

    it('Select review test after reporting a review', async () => {
      const loginUser = test.getLoginUsers().user2;
      const contentIdx = 1;

      const firstGetReviewResponse = await request(test.getServer())
        .get(`/review/all`)
        .query({
          content: contentIdx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      const reviewList: ReviewEntity[] = firstGetReviewResponse.body.reviewList;
      const reviewIdxList = reviewList.map((review) => review.idx);

      expect(reviewIdxList.includes(1)).toBe(true);
      expect(reviewIdxList.includes(2)).toBe(true);

      const reportReviewIdx = 1;
      const reportDto: ReportReviewDto = {
        typeIdx: 1,
      };

      await request(test.getServer())
        .post(`/review/${reportReviewIdx}/report`)
        .send(reportDto)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      const secondGetReviewResponse = await request(test.getServer())
        .get(`/review/all`)
        .query({
          content: contentIdx,
          page: 1,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      const secondReviewList: ReviewEntity[] =
        secondGetReviewResponse.body.reviewList;
      const secondReviewIdxList = secondReviewList.map((review) => review.idx);

      expect(secondReviewIdxList.includes(reportReviewIdx)).toBe(false);
      expect(secondReviewIdxList.includes(2)).toBe(true);
    });

    it('Update first_reported_at Success', async () => {
      const reviewIdx = 1;
      const reportDto: ReportReviewDto = {
        typeIdx: 1,
      };
      const loginUser = test.getLoginUsers().user2;

      const reviewBeforeBeingReported = await test
        .getPrisma()
        .review.findUniqueOrThrow({
          select: {
            firstReportedAt: true,
          },
          where: {
            idx: reviewIdx,
          },
        });

      expect(reviewBeforeBeingReported.firstReportedAt).toBeNull();

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(reportDto)
        .expect(201);

      const review = await test.getPrisma().review.findUniqueOrThrow({
        where: {
          idx: reviewIdx,
        },
      });

      expect(review.firstReportedAt).not.toBeNull();
    });

    it('No Update first_reported_at Success', async () => {
      const reviewIdx = 1;
      const reportDto: ReportReviewDto = {
        typeIdx: 1,
      };
      const loginUser = test.getLoginUsers().user2;

      const firstReportDate = new Date();

      const reviewBeforeBeingReported = await test.getPrisma().review.update({
        where: {
          idx: reviewIdx,
        },
        data: {
          firstReportedAt: firstReportDate,
        },
      });

      expect(reviewBeforeBeingReported.firstReportedAt).toEqual(
        firstReportDate,
      );

      await request(test.getServer())
        .post(`/review/${reviewIdx}/report`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(reportDto)
        .expect(201);

      const review = await test.getPrisma().review.findUniqueOrThrow({
        where: {
          idx: reviewIdx,
        },
      });

      expect(review.firstReportedAt).toEqual(firstReportDate);
    });
  });
});
