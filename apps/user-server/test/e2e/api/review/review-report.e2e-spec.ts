import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { CultureContentSeedHelper, ReviewSeedHelper } from 'libs/testing';
import * as request from 'supertest';

describe('Review Report (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const contentSeedHelper = test.seedHelper(CultureContentSeedHelper);
  const reviewSeedHelper = test.seedHelper(ReviewSeedHelper);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('POST /review/:idx/report', () => {
    it('Success', async () => {
      const contentAuthor = test.getLoginUsers().user1;
      const reviewAuthor = contentAuthor;

      const content = await contentSeedHelper.seed({
        userIdx: contentAuthor.idx,
        acceptedAt: new Date(),
      });

      const review = await reviewSeedHelper.seed({
        userIdx: reviewAuthor.idx,
        contentIdx: content.idx,
      });

      const loginUser = test.getLoginUsers().not(reviewAuthor.idx);

      const response = await request(test.getServer())
        .post(`/review/${review.idx}/report`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });
  });
});
