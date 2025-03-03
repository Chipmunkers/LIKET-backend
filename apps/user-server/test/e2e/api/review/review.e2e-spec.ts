import { LiketService } from 'apps/user-server/src/api/liket/liket.service';
import { ReviewEntity } from 'apps/user-server/src/api/review/entity/review.entity';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { CultureContentSeedHelper, ReviewSeedHelper } from 'libs/testing';
import { TestScheduler } from 'rxjs/testing';
import * as request from 'supertest';

describe('Review (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const contentSeedHelper = test.seedHelper(CultureContentSeedHelper);
  const reviewSeedHelper = test.seedHelper(ReviewSeedHelper);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /review/all', () => {
    it('Success', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const response = await request(test.getServer())
        .get('/review/all')
        .query({
          content: content.idx,
          orderby: 'time',
          page: 1,
          order: 'desc',
        })
        .expect(200);

      expect(response.body?.reviewList).toBeDefined();
      expect(Array.isArray(response.body.reviewList)).toBe(true);
    });

    it('Success - field check', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const reviewAuthor = test.getLoginUsers().not(contentAuthor.idx);

      const [seedReview] = await reviewSeedHelper.seedAll([
        {
          contentIdx: content.idx,
          userIdx: reviewAuthor.idx,
        },
      ]);

      const response = await request(test.getServer())
        .get('/review/all')
        .query({
          content: content.idx,
          page: 1,
        });

      const reviewList: ReviewEntity[] = response.body.reviewList;
      const review = reviewList[0];

      expect(review.idx).toBe(seedReview.idx);
      expect(review.visitTime).toBe(seedReview.visitTime.toISOString());
      expect(review.thumbnail).toBe(seedReview.imgList[0]);
      expect(review.cultureContent.idx).toBe(seedReview.contentIdx);
      expect(review.author.idx).toBe(seedReview.userIdx);
      expect(review.description).toBe(seedReview.description);
      expect(review.starRating).toBe(seedReview.starRating);
      expect(review.likeCount).toBe(seedReview.likeCount);
      expect(review.imgList.sort()).toStrictEqual(seedReview.imgList.sort());
      expect(review.idx).toBe(seedReview.idx);
      expect(review.idx).toBe(seedReview.idx);
    });

    it('Success - content filtering test', async () => {
      const contentAuthor = test.getLoginUsers().user1;

      const [content1, content2] = await contentSeedHelper.seedAll([
        {
          userIdx: contentAuthor.idx,
          acceptedAt: new Date(),
        },
        {
          userIdx: contentAuthor.idx,
          acceptedAt: new Date(),
        },
      ]);

      const reviewAuthor = test.getLoginUsers().not(contentAuthor.idx);

      const [
        content1Review1,
        content1Review2,
        content2Review1,
        content2Review2,
      ] = await reviewSeedHelper.seedAll([
        {
          contentIdx: content1.idx,
          userIdx: reviewAuthor.idx,
        },
        {
          contentIdx: content1.idx,
          userIdx: reviewAuthor.idx,
        },
        {
          contentIdx: content2.idx,
          userIdx: reviewAuthor.idx,
        },
        {
          contentIdx: content2.idx,
          userIdx: reviewAuthor.idx,
        },
      ]);

      const response = await request(test.getServer())
        .get('/review/all')
        .query({
          content: content1.idx,
          orderby: 'time',
          page: 1,
        });

      const reviewList: ReviewEntity[] = response.body.reviewList;

      expect(reviewList.length).toBe(2);
      expect(reviewList.map(({ idx }) => idx).sort()).toStrictEqual(
        [content1Review1.idx, content1Review2.idx].sort(),
      );
    });

    it('Success - user filtering test', async () => {
      const contentAuthor = test.getLoginUsers().user1;

      const author1 = test.getLoginUsers().user1;
      const author2 = test.getLoginUsers().user2;

      const content1 = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const content2 = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const [
        author1Content1Review,
        author1Content2Review,
        author2Content1Review,
        author2Content2Review,
      ] = await reviewSeedHelper.seedAll([
        {
          userIdx: author1.idx,
          contentIdx: content1.idx,
        },
        {
          userIdx: author1.idx,
          contentIdx: content2.idx,
        },
        {
          userIdx: author2.idx,
          contentIdx: content1.idx,
        },
        {
          userIdx: author2.idx,
          contentIdx: content2.idx,
        },
      ]);

      const response = await request(test.getServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${author1.accessToken}`)
        .query({
          orderby: 'time',
          page: 1,
          user: author1.idx,
        })
        .expect(200);

      const reviewList: ReviewEntity[] = response.body.reviewList;

      expect(reviewList.length).toBe(2);
      expect(reviewList.map(({ idx }) => idx).sort()).toStrictEqual(
        [author1Content1Review.idx, author1Content2Review.idx].sort(),
      );
    });

    it('Success - review filtering', async () => {
      const contentAuthor = test.getLoginUsers().user1;

      const author = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const [
        firstReview,
        secondReview,
        thirdReview,
        fourthReview,
        fifthReview,
        sixthReview,
      ] = await reviewSeedHelper.seedAll([
        {
          contentIdx: content.idx,
          userIdx: author.idx,
        },
        {
          contentIdx: content.idx,
          userIdx: author.idx,
        },
        {
          contentIdx: content.idx,
          userIdx: author.idx,
        },
        {
          contentIdx: content.idx,
          userIdx: author.idx,
        },
        {
          contentIdx: content.idx,
          userIdx: author.idx,
        },
        {
          contentIdx: content.idx,
          userIdx: author.idx,
        },
      ]);

      const response = await request(test.getServer())
        .get('/review/all')
        .query({
          orderby: 'time',
          page: 1,
          content: content.idx,
          review: sixthReview.idx,
        })
        .expect(200);

      const reviewList: ReviewEntity[] = response.body.reviewList;

      expect(reviewList.length).toBe(6);
      expect(reviewList[0].idx).toBe(sixthReview.idx);

      const response2 = await request(test.getServer())
        .get('/review/all')
        .query({
          orderby: 'time',
          page: 2,
          content: content.idx,
          review: sixthReview.idx,
        })
        .expect(200);

      const reviewList2: ReviewEntity[] = response2.body.reviewList;

      expect(reviewList2.length).toBe(0);
    });

    it('Attempt to get reviews of other user', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          user: 2,
        })
        .expect(403);
    });

    it('Attempt to get review without liket', async () => {
      const loginUser = test.getLoginUsers().user2;

      const [firstContent, secondContent, thirdContent] =
        await contentSeedHelper.seedAll([
          {
            userIdx: test.getLoginUsers().not(loginUser.idx).idx,
            acceptedAt: new Date(),
          },
          {
            userIdx: test.getLoginUsers().not(loginUser.idx).idx,
            acceptedAt: new Date(),
          },
          {
            userIdx: test.getLoginUsers().not(loginUser.idx).idx,
            acceptedAt: new Date(),
          },
        ]);

      const [reviewWithLiket] = await reviewSeedHelper.seedAll([
        {
          contentIdx: firstContent.idx,
          userIdx: loginUser.idx,
        },
        {
          contentIdx: secondContent.idx,
          userIdx: loginUser.idx,
        },
        {
          contentIdx: thirdContent.idx,
          userIdx: loginUser.idx,
        },
      ]);

      const createdLiket = await test
        .get(LiketService)
        .createLiket(reviewWithLiket.idx, {
          bgImgInfo: {} as any,
          bgImgPath: '/path/image.png',
          cardImgPath: '/path2/image.png',
          description: 'hi',
          imgShapes: [],
          size: 1,
          textShape: {} as any,
        });

      const { body } = await request(test.getServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          user: loginUser.idx,
          liket: true,
        })
        .expect(200);

      const responseReviewList: ReviewEntity[] = body.reviewList;
      expect(responseReviewList.length).toBe(1);
      expect(responseReviewList[0].idx).toBe(reviewWithLiket.idx);

      const { body: secondBody } = await request(test.getServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          user: loginUser.idx,
          liket: false,
        })
        .expect(200);

      const secondResponseReviewList: ReviewEntity[] = secondBody.reviewList;
      expect(secondResponseReviewList.length).toBe(2);
    });

    it('Non-existent content', async () => {
      const loginUser = test.getLoginUsers().user2;
      const notExistContentIdx = -9999;

      await request(test.getServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          content: notExistContentIdx,
        })
        .expect(404);
    });

    it('Non-accepted content | author', async () => {
      const loginUser = test.getLoginUsers().user2;
      const reviewCreateUser = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: null,
      });

      const [firstReview, secondReview] = await reviewSeedHelper.seedAll([
        {
          userIdx: reviewCreateUser.idx,
          contentIdx: content.idx,
        },
        {
          userIdx: loginUser.idx,
          contentIdx: content.idx,
        },
        {
          userIdx: loginUser.idx,
          contentIdx: content.idx,
          deletedAt: new Date(),
        },
      ]);

      const response = await request(test.getServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          content: content.idx,
        })
        .expect(200);

      const reviewList: ReviewEntity[] = response.body.reviewList;

      expect(reviewList[0].idx).toBe(secondReview.idx);
      expect(reviewList[1].idx).toBe(firstReview.idx);
    });

    // TODO: liket filtering 테스트 케이스 추가 해야함

    it('Non-accepted content | not author', async () => {
      const loginUser = test.getLoginUsers().user2;
      const otherUser = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: otherUser.idx,
        acceptedAt: null,
      });

      await request(test.getServer())
        .get('/review/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          content: content.idx,
        })
        .expect(403);
    });

    it('Invalid dto - content', async () => {
      await request(test.getServer())
        .get('/review/all')
        .query({
          content: 'invalid', // Invalid content
          orderby: 'time',
          page: 1,
          order: 'desc',
        })
        .expect(400);
    });

    it('Invalid dto - user', async () => {
      await request(test.getServer())
        .get('/review/all')
        .query({
          content: 1,
          user: 'invalid', // Invalid user
          orderby: 'time',
          page: 1,
          order: 'desc',
        })
        .expect(400);
    });

    it('Invalid dto - orderby', async () => {
      await request(test.getServer())
        .get('/review/all')
        .query({
          content: 1,
          orderby: 'invalid', // Invalid orderby
          page: 1,
          order: 'desc',
        })
        .expect(400);
    });
  });

  describe('GET /review/:idx', () => {
    it('Success - no token', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      const response = await request(test.getServer())
        .get(`/review/${review.idx}`)
        .expect(200);

      expect(response.body?.idx).toBe(review.idx);
    });

    it('Success - field check', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      const response = await request(test.getServer())
        .get(`/review/${review.idx}`)
        .expect(200);

      const responseReview: ReviewEntity = response.body;

      expect(responseReview.idx).toBe(review.idx);
      expect(responseReview.author.idx).toBe(review.userIdx);
      expect(responseReview.thumbnail).toBe(review.imgList[0]);
      expect(responseReview.visitTime).toBe(review.visitTime.toISOString());
      expect(responseReview.cultureContent.idx).toBe(review.contentIdx);
      expect(responseReview.imgList.sort()).toStrictEqual(
        review.imgList.sort(),
      );
      expect(responseReview.description).toBe(review.description);
      expect(responseReview.starRating).toBe(review.starRating);
      expect(responseReview.likeCount).toBe(review.likeCount);
    });

    it('Success - with login token', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      const response = await request(test.getServer())
        .get(`/review/${review.idx}`)
        .set('Authorization', `Bearer ${reviewAuthor.accessToken}`)
        .expect(200);

      expect(response.body.idx).toBe(review.idx);
    });

    it('Non-existent review', async () => {
      const reviewIdx = -999999;
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });
  });

  describe('GET /review/hot/all', () => {
    it('Success - no token', async () => {
      const response = await request(test.getServer())
        .get('/review/hot/all')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Success - login', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/review/hot/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Success - order test', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().not(contentAuthor.idx);

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const [like4Review, like3Review, like7Review] =
        await reviewSeedHelper.seedAll([
          {
            contentIdx: content.idx,
            userIdx: reviewAuthor.idx,
            likeCount: 4,
          },
          {
            contentIdx: content.idx,
            userIdx: reviewAuthor.idx,
            likeCount: 3,
          },
          {
            contentIdx: content.idx,
            userIdx: reviewAuthor.idx,
            likeCount: 7,
          },
        ]);

      const response = await request(test.getServer())
        .get('/review/hot/all')
        .expect(200);

      const responseReviewList: ReviewEntity[] = response.body;

      expect(responseReviewList.map(({ idx }) => idx)).toStrictEqual([
        like7Review.idx,
        like4Review.idx,
        like3Review.idx,
      ]);
    });

    it('Success - a review created 8 days ago', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().not(contentAuthor.idx);

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

      const now = new Date();

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const reviewSeedList = await reviewSeedHelper.seedAll([
        {
          contentIdx: content.idx,
          userIdx: reviewAuthor.idx,
          likeCount: 1000,
          createdAt: eightDaysAgo,
        },
        {
          contentIdx: content.idx,
          userIdx: reviewAuthor.idx,
          likeCount: 5,
          createdAt: now,
        },
        {
          contentIdx: content.idx,
          userIdx: reviewAuthor.idx,
          likeCount: 4,
          createdAt: now,
        },
        {
          contentIdx: content.idx,
          userIdx: reviewAuthor.idx,
          likeCount: 3,
          createdAt: now,
        },
      ]);

      const response = await request(test.getServer())
        .get('/review/hot/all')
        .expect(200);

      const responseReviewList: ReviewEntity[] = response.body;

      expect(responseReviewList.map(({ idx }) => idx)).toStrictEqual(
        reviewSeedList
          .filter(({ createdAt }) => new Date(createdAt) > sevenDaysAgo)
          .sort((prev, next) => next.likeCount - prev.likeCount)
          .map(({ idx }) => idx),
      );
    });
  });

  describe('POST /culture-content/:idx/review', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      const contentAuthor = test.getLoginUsers().user2;
      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(201);
    });

    it('No token', async () => {
      const contentAuthor = test.getLoginUsers().user2;
      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/review`)
        .set('Authorization', `Bearer ${null}`)
        .send({
          title: 'review title',
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(401);
    });

    it('Non-existent content', async () => {
      const contentIdx = -99999; // Non-existent content
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(404);
    });

    it('Non-accepted content', async () => {
      const loginUser = test.getLoginUsers().user1;

      const contentAuthor = test.getLoginUsers().user2;
      const notAccepetedContent = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: null,
      });

      await request(test.getServer())
        .post(`/culture-content/${notAccepetedContent.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(404);
    });

    it('Invalid path parameter', async () => {
      const contentIdx = 'invalid'; // Invalid path parameter
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .post(`/culture-content/${contentIdx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - starRating', async () => {
      const contentAuthor = test.getLoginUsers().user2;
      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 'invalid', // Invalid star rating
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - description', async () => {
      const contentAuthor = test.getLoginUsers().user2;
      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: '', // Invalid description
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - visit time', async () => {
      const contentAuthor = test.getLoginUsers().user2;
      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: 'Invalid date', // Invalid visitTime
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - img list', async () => {
      const contentAuthor = test.getLoginUsers().user2;
      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/review`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: new Date(),
          imgList: [1, 2, 3], // Invalid img list
        })
        .expect(400);
    });
  });

  describe('PUT /review/:idx', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      const contentAuthor = test.getLoginUsers().user2;
      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: loginUser.idx,
        contentIdx: content.idx,
        description: 'description before modifying',
        imgList: ['/review/img1.png', '/review/img2.png'],
        visitTime: new Date('2024-07-11'),
        starRating: 3,
      });

      const descriptionAfterModifying = 'description after modifying';
      const starRatingAfterModifying = 5;
      const visitTimeAfterModifying = new Date();

      await request(test.getServer())
        .put(`/review/${review.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: starRatingAfterModifying,
          description: descriptionAfterModifying,
          visitTime: visitTimeAfterModifying,
          imgList: ['/review/review.img'],
        })
        .expect(201);

      const afterModifyingReveiw = await test
        .getPrisma()
        .review.findUniqueOrThrow({
          where: {
            idx: review.idx,
          },
        });

      expect(afterModifyingReveiw.description).toBe(descriptionAfterModifying);
      expect(afterModifyingReveiw.starRating).toBe(starRatingAfterModifying);
      expect(afterModifyingReveiw.visitTime).toStrictEqual(
        visitTimeAfterModifying,
      );
    });

    it('Non-existent review', async () => {
      const reviewIdx = -9999; // Non-existent review
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(404);
    });

    it('Attempt to update review of other user', async () => {
      const loginUser = test.getLoginUsers().user2;
      const reviewAuthor = test.getLoginUsers().user1;
      const contentAuthor = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      await request(test.getServer())
        .put(`/review/${review.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(403);
    });

    it('Invalid path parameter', async () => {
      const contentIdx = 'invalid'; // Invalid path parameter
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .put(`/review/${contentIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - starRating', async () => {
      const reviewIdx = 1;
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 'invalid', // Invalid star rating
          description: 'review description',
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - description', async () => {
      const reviewIdx = 1;
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: '', // Invalid description
          visitTime: '2024-07-11',
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - visit time', async () => {
      const reviewIdx = 1;
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: 'Invalid date', // Invalid visitTime
          imgList: ['/review/review.img'],
        })
        .expect(400);
    });

    it('Invalid DTO - img list', async () => {
      const reviewIdx = 1;
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .put(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          starRating: 4,
          description: 'review description',
          visitTime: new Date(),
          imgList: [1, 2, 3], // Invalid img list
        })
        .expect(400);
    });
  });

  describe('DELETE /review/:idx', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user2;
      const contentAuthor = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: loginUser.idx,
        contentIdx: content.idx,
      });

      await request(test.getServer())
        .delete(`/review/${review.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('No token', async () => {
      const reviewIdx = 'invalid'; // Invalid path parameter

      await request(test.getServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Non-existent review', async () => {
      const reviewIdx = -9999; // Non-existent review
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('Attempt to delete review of other user', async () => {
      const loginUser = test.getLoginUsers().user2;
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      await request(test.getServer())
        .delete(`/review/${review.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Invalid path parameter', async () => {
      const reviewIdx = 'invalid'; // Invalid path parameter
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .delete(`/review/${reviewIdx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });
  });

  describe('POST /review/:idx/like', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user2;
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      await request(test.getServer())
        .post(`/review/${review.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Duplicate like', async () => {
      const loginUser = test.getLoginUsers().user2;
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      await request(test.getServer())
        .post(`/review/${review.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(test.getServer())
        .post(`/review/${review.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(409);
    });

    it('No token', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      await request(test.getServer())
        .post(`/review/${review.idx}/like`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Like non-existent review', async () => {
      const reviewIdx = -9999; // Non-existent review
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .post(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });
  });

  describe('DELETE /review/:idx/like', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      await request(test.getServer())
        .post(`/review/${review.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(test.getServer())
        .delete(`/review/${review.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Cancel like (already unliked)', async () => {
      const loginUser = test.getLoginUsers().user1;
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      await request(test.getServer())
        .delete(`/review/${review.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(409);
    });

    it('Non-existent review', async () => {
      const reviewIdx = -999999; // Non-existent
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .delete(`/review/${reviewIdx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('No token', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      await request(test.getServer())
        .delete(`/review/${review.idx}/like`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });
  });
});
