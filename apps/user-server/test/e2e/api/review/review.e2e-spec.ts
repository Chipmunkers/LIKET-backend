import { ReviewEntity } from 'apps/admin-server/src/api/review/entity/review.entity';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { CultureContentSeedHelper, ReviewSeedHelper } from 'libs/testing';
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
      const response = await request(test.getServer())
        .get('/review/all')
        .query({
          content: 1,
          orderby: 'time',
          page: 1,
          order: 'desc',
        })
        .expect(200);

      expect(response.body?.reviewList).toBeDefined();
      expect(Array.isArray(response.body.reviewList)).toBe(true);
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
