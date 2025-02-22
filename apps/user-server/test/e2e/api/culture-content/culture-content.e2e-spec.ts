import { CreateContentRequestDto } from 'apps/user-server/src/api/culture-content/dto/create-content-request.dto';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { CultureContentSeedHelper } from 'libs/testing';
import * as request from 'supertest';
import invalidCreateContentRequest from './invalid-create-content-request';
import { GENRE } from 'libs/core/tag-root/genre/constant/genre';
import { CultureContentCoreService } from 'libs/core/culture-content/culture-content-core.service';
import { SummaryContentEntity } from 'apps/user-server/src/api/culture-content/entity/summary-content.entity';

describe('Culture Content (e2e)', () => {
  const test = TestHelper.create(AppModule);
  const contentSeedHelper = test.seedHelper(CultureContentSeedHelper);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('GET /culture-content/all', () => {
    it('Success: all content with token', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: get my contents', async () => {
      const otherUser = test.getLoginUsers().user1;
      const loginUser = test.getLoginUsers().user2;

      await contentSeedHelper.seedAll([
        { userIdx: otherUser.idx, acceptedAt: new Date() },
        { userIdx: loginUser.idx, acceptedAt: new Date() },
        { userIdx: loginUser.idx },
        { userIdx: loginUser.idx, deletedAt: new Date() },
      ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          user: loginUser.idx,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body.contentList)).toBeTruthy();
      expect(response.body.contentList.length).toBe(2);
    });

    it('Success: Get Open contents test with end date null', async () => {
      const oneMothAfter = new Date();
      oneMothAfter.setMonth(oneMothAfter.getMonth() + 1);

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const [endDateNullContents, endDateNotNullContents] =
        await contentSeedHelper.seedAll([
          {
            userIdx: test.getLoginUsers().user1.idx,
            startDate: oneMonthAgo,
            endDate: null,
            acceptedAt: new Date(),
          },
          {
            userIdx: test.getLoginUsers().user1.idx,
            startDate: oneMonthAgo,
            endDate: oneMothAfter,
            acceptedAt: new Date(),
          },
        ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          open: true,
        });

      const contentList = response.body.contentList;

      expect(contentList.length).toBe(2);
    });

    it('Success: Get Open contents with not open content', async () => {
      const oneMothAfter = new Date();
      oneMothAfter.setMonth(oneMothAfter.getMonth() + 1);

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const [firstContent, secondContent] = await contentSeedHelper.seedAll([
        {
          userIdx: test.getLoginUsers().user1.idx,
          startDate: oneMothAfter,
          endDate: null,
          acceptedAt: new Date(),
        },
        {
          userIdx: test.getLoginUsers().user1.idx,
          startDate: oneMonthAgo,
          endDate: oneMothAfter,
          acceptedAt: new Date(),
        },
      ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          open: true,
        });

      const contentList = response.body.contentList;

      expect(contentList.length).toBe(1);
      expect(contentList[0].idx).toBe(secondContent.idx);
    });

    it('Success: Get Open contents with not open content - 2', async () => {
      const oneMothAfter = new Date();
      oneMothAfter.setMonth(oneMothAfter.getMonth() + 1);

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const [firstContent, secondContent] = await contentSeedHelper.seedAll([
        {
          userIdx: test.getLoginUsers().user1.idx,
          startDate: oneMonthAgo,
          endDate: null,
          acceptedAt: new Date(),
        },
        {
          userIdx: test.getLoginUsers().user1.idx,
          startDate: oneMothAfter,
          endDate: oneMothAfter,
          acceptedAt: new Date(),
        },
      ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          open: true,
        });

      const contentList = response.body.contentList;

      expect(contentList.length).toBe(1);
      expect(contentList[0].idx).toBe(firstContent.idx);
    });

    it('Get not accepted contents', async () => {
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Get not accepted contents that were created by login user', async () => {
      const otherUser = test.getLoginUsers().user1;
      const loginUser = test.getLoginUsers().user2;

      const [content1, content2] = await contentSeedHelper.seedAll([
        { userIdx: loginUser.idx, acceptedAt: null },
        { userIdx: loginUser.idx, acceptedAt: null },
        { userIdx: otherUser.idx, acceptedAt: null },
        { userIdx: loginUser.idx, acceptedAt: null, deletedAt: new Date() },
      ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: loginUser.idx,
          order: 'asc',
          orderby: 'create',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      const { contentList } = response.body;

      expect(contentList.length).toBe(2);
      expect(contentList[0].idx).toBe(content1.idx);
      expect(contentList[1].idx).toBe(content2.idx);
    });

    it('Success: genre filter', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: genre filter without login token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
        })
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Genre filtering test', async () => {
      const randomUser = test.getLoginUsers().user2;

      const [acceptedConcertContent] = await contentSeedHelper.seedAll([
        {
          userIdx: randomUser.idx,
          acceptedAt: new Date(),
          genreIdx: GENRE.CONCERT,
        },
        {
          userIdx: randomUser.idx,
          acceptedAt: new Date(),
          genreIdx: GENRE.FESTIVAL,
        },
        {
          userIdx: randomUser.idx,
          genreIdx: GENRE.CONCERT,
        },
        {
          userIdx: randomUser.idx,
          acceptedAt: new Date(),
          genreIdx: GENRE.CONCERT,
          deletedAt: new Date(0),
        },
      ]);

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: GENRE.CONCERT,
        });

      const contentList = response.body.contentList;

      expect(contentList.length).toBe(1);
      expect(contentList[0].idx).toBe(acceptedConcertContent.idx);
    });

    it('Success: age filter', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
          age: 2,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: style filter', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
          age: 2,
          style: 3,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: region filter', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
          age: 2,
          style: 3,
          region: '11',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: open filter', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
          age: 2,
          style: 3,
          region: '11',
          open: true,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success: orderby', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          genre: 1,
          age: 2,
          style: 3,
          region: '11',
          open: true,
          orderby: 'create',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('No token', async () => {
      await request(test.getServer()).get('/culture-content/all').expect(200);
    });

    it('Filter other user', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          user: 2,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Filter other user', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          user: 2,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Filter not accepted contents with other user', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 2,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Valid DTO - 1', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: true,
          user: 1,
          genre: 1,
          age: 1,
          region: '10',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);
    });

    it('Valid DTO - 2', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 2,
          age: 2,
          region: '11',
          style: 3,
          open: false,
          orderby: 'like',
          search: '도라에몽',
          page: 1,
          order: 'asc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);
    });

    it('Invalid DTO - accept', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: 'invalid', // Invalid
          user: 2,
          genre: 1,
          age: 1,
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - accept', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: 0, // Invalid
          user: 2,
          genre: 1,
          age: 1,
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - user', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 'user', // Invalid
          genre: 1,
          age: 1,
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - genre', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 'genre', // Invalid
          age: 1,
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - age', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 'age', // Invalid
          region: '4514069000',
          style: 3,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - style', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 'style', // Invalid
          open: true,
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - open', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 1,
          open: 'open', // Invalid
          orderby: 'time',
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - orderby', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 1,
          open: true,
          orderby: 'orderby', // Invalid
          search: '디올',
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - search', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 1,
          open: true,
          orderby: 'time',
          search: '10글자이상되는검색어입니다.', // Invalid
          page: 2,
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - page', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 1,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 'page', // Invalid
          order: 'desc',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('Invalid DTO - order', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/all')
        .query({
          accept: false,
          user: 1,
          genre: 1,
          age: 1,
          region: '4514069000123',
          style: 1,
          open: true,
          orderby: 'time',
          search: '디올',
          page: 1,
          order: 'order', // Invalid
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });
  });

  describe('GET /culture-content/soon-open/all', () => {
    it('Success with no token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/soon-open/all')
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success with token', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/soon-open/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success with contents', async () => {
      const oneMonthAfter = new Date();
      oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);

      await contentSeedHelper.seedAll([
        {
          userIdx: test.getLoginUsers().user1.idx,
          startDate: oneMonthAfter,
          endDate: null,
          acceptedAt: new Date(),
        },
        {
          userIdx: test.getLoginUsers().user1.idx,
          startDate: oneMonthAfter,
          endDate: oneMonthAfter,
          acceptedAt: new Date(),
        },
        {
          // open state content
          userIdx: test.getLoginUsers().user1.idx,
          startDate: new Date(),
          endDate: null,
          acceptedAt: new Date(),
        },
      ]);

      const response = await request(test.getServer()).get(
        '/culture-content/soon-open/all',
      );

      const { contentList } = response.body;

      expect(contentList.length).toBe(2);
    });
  });

  describe('GET /culture-content/soon-end/all', () => {
    it('Success with no token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/soon-end/all')
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success with token', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/soon-end/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body?.contentList).toBeDefined();
      expect(Array.isArray(response.body?.contentList)).toBe(true);
    });

    it('Success with contents', async () => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const oneDateAfter = new Date();
      oneDateAfter.setDate(oneDateAfter.getDate() + 1);

      await contentSeedHelper.seedAll([
        {
          userIdx: test.getLoginUsers().user1.idx,
          startDate: oneDateAfter,
          endDate: oneDateAfter,
          acceptedAt: new Date(),
        },
        {
          userIdx: test.getLoginUsers().user1.idx,
          startDate: new Date(),
          endDate: null,
          acceptedAt: new Date(),
        },
        {
          // open state content
          userIdx: test.getLoginUsers().user1.idx,
          startDate: new Date(),
          endDate: null,
          acceptedAt: new Date(),
        },
      ]);

      const response = await request(test.getServer()).get(
        '/culture-content/soon-open/all',
      );

      const { contentList } = response.body;

      expect(contentList.length).toBe(1);
    });
  });

  describe('GET /culture-content/all', () => {
    it('Success with no token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/hot/all')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      for (const genre of response.body) {
        expect(Array.isArray(genre.contentList)).toBe(true);
      }
    });

    it('Success with token', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/hot/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      for (const genre of response.body) {
        expect(Array.isArray(genre.contentList)).toBe(true);
      }
    });
  });

  describe('GET /culture-content/hot-age/all', () => {
    it('Success with no token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/hot-age/all')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body.contentList)).toBe(true);
    });

    it('Success with token', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/hot-age/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body.contentList)).toBe(true);
    });
  });

  describe('GET /culture-content/hot-style/all', () => {
    it('Success with no token', async () => {
      const response = await request(test.getServer())
        .get('/culture-content/hot-style/all')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body.contentList)).toBe(true);
    });

    it('Success with token', async () => {
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .get('/culture-content/hot-style/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body.contentList)).toBe(true);
    });
  });

  describe('POST /culture-content/:idx/like', () => {
    it("Success - like author's content", async () => {
      const loginUser = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: new Date(),
      });

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Success - like for content user do not own', async () => {
      const loginUser = test.getLoginUsers().user2;
      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().not(loginUser.idx).idx,
        acceptedAt: new Date(),
      });

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Success - like not accepted content', async () => {
      const loginUser = test.getLoginUsers().user2;
      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: null,
      });

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Duplicate like', async () => {
      const loginUser = test.getLoginUsers().user1;
      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
      });

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(409);
    });

    it('Duplicate like, like the other user', async () => {
      const loginUser = test.getLoginUsers().user1;
      const otherLoginUserToken = test.getLoginUsers().user2;

      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: new Date(),
      });

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(409);

      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${otherLoginUserToken.accessToken}`)
        .expect(201);
    });

    it('No token', async () => {
      const idx = 1; // Non-existent content idx

      // 좋아요 취소하기
      await request(test.getServer())
        .post(`/culture-content/${idx}/like`)
        .expect(401);
    });
  });

  describe('DELETE /culture-content/:idx/like', () => {
    it("Success - author's content", async () => {
      const loginUser = test.getLoginUsers().user1;
      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: new Date(),
      });

      // 좋아요 누르기
      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      // 좋아요 취소하기
      await request(test.getServer())
        .delete(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Success - Non-author cancels like', async () => {
      const loginUser = test.getLoginUsers().user1;
      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: new Date(),
      });

      // 좋아요 누르기
      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      // 좋아요 취소하기
      await request(test.getServer())
        .delete(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Cancel like (already disliked)', async () => {
      const content = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().user2.idx,
        acceptedAt: new Date(),
      });
      const loginUser = test.getLoginUsers().user1;

      // 좋아요 취소하기
      await request(test.getServer())
        .delete(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(409);
    });

    it('Success - like again', async () => {
      const loginUser = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: new Date(),
      });

      // 좋아요 누르기
      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      // 좋아요 취소하기
      await request(test.getServer())
        .delete(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      // 좋아요 누르기
      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Cancel like non-existent content', async () => {
      const idx = 99999; // Non-existent content idx
      const loginUser = test.getLoginUsers().user1;

      // 좋아요 취소하기
      await request(test.getServer())
        .delete(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('Invalid path parameter', async () => {
      const idx = 'invalidPathParameter'; // Non-existent content idx
      const loginUser = test.getLoginUsers().user1;

      // 좋아요 취소하기
      await request(test.getServer())
        .delete(`/culture-content/${idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });

    it('No token', async () => {
      const idx = 1;

      // 좋아요 취소하기
      await request(test.getServer())
        .delete(`/culture-content/${idx}/like`)
        // No token
        .expect(401);
    });
  });

  describe('POST /culture-content/request', () => {
    it('Success', async () => {
      const createDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.9959729576795,
          positionY: 35.97664845766847,
          hCode: '1231231231',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };
      const loginUser = test.getLoginUsers().user1;

      const response = await request(test.getServer())
        .post('/culture-content/request')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(200);

      const createdContentIdx: number = response.body.idx;

      expect(createdContentIdx).toBeDefined();

      const content = await test.getPrisma().cultureContent.findUniqueOrThrow({
        include: {
          Style: {
            include: {
              Style: {
                select: {
                  idx: true,
                },
              },
            },
          },
          Location: true,
        },
        where: { idx: createdContentIdx },
      });

      expect(content.idx).toBe(createdContentIdx);
      expect(content.title).toBe(createDto.title);
      expect(content.description).toBe(createDto.description);
      expect(content.websiteLink).toBe(createDto.websiteLink);
      expect(content.startDate.toISOString()).toBe(
        createDto.startDate.toISOString(),
      );
      expect(content.endDate?.toISOString()).toBe(
        createDto.endDate?.toISOString(),
      );
      expect(content.openTime).toBe(createDto.openTime);
      expect(content.genreIdx).toBe(createDto.genreIdx);
      expect(
        content.Style.map(({ styleIdx }) => styleIdx).sort(),
      ).toStrictEqual(createDto.styleIdxList.sort());
      expect(content.ageIdx).toBe(createDto.ageIdx);
      expect(content.Location.address).toBe(createDto.location.address);
      expect(content.Location.detailAddress).toBe(
        createDto.location.detailAddress,
      );
      expect(content.Location.region1Depth).toBe(
        createDto.location.region1Depth,
      );
      expect(content.Location.region2Depth).toBe(
        createDto.location.region2Depth,
      );
      expect(content.Location.positionX).toBe(createDto.location.positionX);
      expect(content.Location.positionY).toBe(createDto.location.positionY);
      expect(content.Location.hCode).toBe(createDto.location.hCode);
      expect(content.Location.bCode).toBe(createDto.location.bCode);
      expect(content.Location.sidoCode).toBe(
        createDto.location.bCode.substring(0, 2),
      );
      expect(content.Location.sggCode).toBe(
        createDto.location.bCode.substring(2, 5),
      );
      expect(content.Location.legCode).toBe(
        createDto.location.bCode.substring(5, 8),
      );
      expect(content.Location.riCode).toBe(
        createDto.location.bCode.substring(8, 10),
      );
      expect(content.isFee).toBe(createDto.isFee);
      expect(content.isPet).toBe(createDto.isPet);
      expect(content.isReservation).toBe(createDto.isReservation);
      expect(content.isParking).toBe(createDto.isParking);
    });

    it('No token', async () => {
      const createDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };

      await request(test.getServer())
        .post('/culture-content/request')
        .send(createDto)
        .expect(401);
    });

    it('Invalid dto', async () => {
      const loginUser = test.getLoginUsers().user1;

      for (const dto of invalidCreateContentRequest()) {
        await request(test.getServer())
          .post('/culture-content/request')
          .set('Authorization', `Bearer ${loginUser.accessToken}`)
          .send(dto)
          .expect(400);
      }
    });
  });

  describe('PUT /culture-content/request/:idx', () => {
    it('Success', async () => {
      const createDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };
      const loginUser = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: null,
      });

      await request(test.getServer())
        .put(`/culture-content/request/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(201);
    });

    it('Success - check updated field', async () => {
      const loginUser = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: null,
      });

      const contentBeforeUpdate = await test
        .getPrisma()
        .cultureContent.findUniqueOrThrow({
          include: {
            Style: { include: { Style: true } },
            ContentImg: true,
            Location: true,
          },
          where: { idx: content.idx },
        });

      expect(contentBeforeUpdate.idx).toBe(content.idx);
      expect(contentBeforeUpdate.title).toBe(content.title);
      expect(contentBeforeUpdate.description).toBe(content.description);
      expect(
        contentBeforeUpdate.ContentImg.map((img) => img.imgPath).sort(),
      ).toStrictEqual(content.imgList.sort());

      expect(contentBeforeUpdate.startDate).toStrictEqual(content.startDate);
      expect(contentBeforeUpdate.endDate).toStrictEqual(content.endDate);
      expect(contentBeforeUpdate.openTime).toBe(content.openTime);
      expect(contentBeforeUpdate.genreIdx).toBe(content.genreIdx);
      expect(contentBeforeUpdate.ageIdx).toBe(content.ageIdx);
      expect(
        contentBeforeUpdate.Style.map(({ styleIdx }) => styleIdx).sort(),
      ).toStrictEqual(content.styleIdxList.sort());
      expect(contentBeforeUpdate.Location.address).toBe(
        content.location.address,
      );
      expect(contentBeforeUpdate.Location.detailAddress).toBe(
        content.location.detailAddress,
      );
      expect(contentBeforeUpdate.Location.region1Depth).toBe(
        content.location.region1Depth,
      );
      expect(contentBeforeUpdate.Location.region2Depth).toBe(
        content.location.region2Depth,
      );
      expect(contentBeforeUpdate.Location.bCode).toBe(content.location.bCode);
      expect(contentBeforeUpdate.Location.hCode).toBe(content.location.hCode);
      expect(contentBeforeUpdate.Location.positionX).toBe(
        content.location.positionX,
      );
      expect(contentBeforeUpdate.Location.positionY).toBe(
        content.location.positionY,
      );

      expect(contentBeforeUpdate.isFee).toBe(content.isFee);
      expect(contentBeforeUpdate.isReservation).toBe(content.isReservation);
      expect(contentBeforeUpdate.isParking).toBe(content.isParking);
      expect(contentBeforeUpdate.isPet).toBe(content.isPet);
      expect(contentBeforeUpdate.acceptedAt).toStrictEqual(content.acceptedAt);

      const updateDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.9959729576795,
          positionY: 35.9766484576684,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };

      await request(test.getServer())
        .put(`/culture-content/request/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(updateDto)
        .expect(201);

      const contentAfterUpdate = await test
        .getPrisma()
        .cultureContent.findUniqueOrThrow({
          include: {
            Style: { include: { Style: true } },
            ContentImg: true,
            Location: true,
          },
          where: { idx: content.idx },
        });

      expect(contentAfterUpdate.title).toBe(updateDto.title);
      expect(contentAfterUpdate.description).toBe(updateDto.description);
      expect(
        contentAfterUpdate.ContentImg.map((img) => img.imgPath).sort(),
      ).toStrictEqual(updateDto.imgList.sort());

      expect(contentAfterUpdate.startDate).toStrictEqual(updateDto.startDate);
      expect(contentAfterUpdate.endDate).toStrictEqual(updateDto.endDate);
      expect(contentAfterUpdate.openTime).toBe(updateDto.openTime);
      expect(contentAfterUpdate.genreIdx).toBe(updateDto.genreIdx);
      expect(contentAfterUpdate.ageIdx).toBe(updateDto.ageIdx);
      expect(
        contentAfterUpdate.Style.map(({ styleIdx }) => styleIdx).sort(),
      ).toStrictEqual(updateDto.styleIdxList.sort());
      expect(contentAfterUpdate.Location.address).toBe(
        updateDto.location.address,
      );
      expect(contentAfterUpdate.Location.detailAddress).toBe(
        updateDto.location.detailAddress,
      );
      expect(contentAfterUpdate.Location.region1Depth).toBe(
        updateDto.location.region1Depth,
      );
      expect(contentAfterUpdate.Location.region2Depth).toBe(
        updateDto.location.region2Depth,
      );
      expect(contentAfterUpdate.Location.bCode).toBe(updateDto.location.bCode);
      expect(contentAfterUpdate.Location.hCode).toBe(updateDto.location.hCode);
      expect(contentAfterUpdate.Location.positionX).toBe(
        updateDto.location.positionX,
      );
      expect(contentAfterUpdate.Location.positionY).toBe(
        updateDto.location.positionY,
      );

      expect(contentAfterUpdate.isFee).toBe(updateDto.isFee);
      expect(contentAfterUpdate.isReservation).toBe(updateDto.isReservation);
      expect(contentAfterUpdate.isParking).toBe(updateDto.isParking);
      expect(contentAfterUpdate.isPet).toBe(updateDto.isPet);
    });

    it('Non author update content', async () => {
      const createDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };
      const loginUser = test.getLoginUsers().user2;

      const contentOfOtherUser = await contentSeedHelper.seed({
        userIdx: test.getLoginUsers().not(loginUser.idx).idx,
        acceptedAt: new Date(),
      });

      await request(test.getServer())
        .put(`/culture-content/request/${contentOfOtherUser.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(403);
    });

    it('Update non-existent content', async () => {
      const createDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };
      const loginUser = test.getLoginUsers().user1;
      const idx = 9999; // Non-existent content

      await request(test.getServer())
        .put(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(404);
    });

    it('Update accepted content', async () => {
      const createDto = {
        title: '도라에몽 팝업 스토어',
        description: '도라에몽 팝업 스토어 입니다.',
        websiteLink: 'liket.site',
        imgList: ['/content/test.img'],
        startDate: new Date(),
        endDate: new Date(),
        openTime: '평일 6 ~ 12시',
        genreIdx: 1,
        styleIdxList: [1, 2, 3],
        ageIdx: 1,
        location: {
          detailAddress: 'LH아파트 1250호',
          address: '전북 익산시 부송동 100',
          region1Depth: '서울',
          region2Depth: '강동구',
          positionX: 126.99597295767953,
          positionY: 35.97664845766847,
          hCode: '4514069000',
          bCode: '4514013400',
        },
        isFee: true,
        isReservation: true,
        isParking: true,
        isPet: true,
      };
      const loginUser = test.getLoginUsers().user1;

      const acceptedContent = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: new Date(),
      });

      await request(test.getServer())
        .put(`/culture-content/request/${acceptedContent.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(createDto)
        .expect(409);
    });
  });

  describe('DELETE /culture-content/request/:idx', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      const content = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        deletedAt: null,
      });

      await request(test.getServer())
        .delete(`/culture-content/request/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);
    });

    it('Non author delete content', async () => {
      const loginUser = test.getLoginUsers().user2; // Non author
      const otherUser = test.getLoginUsers().not(loginUser.idx);

      const content = await contentSeedHelper.seed({
        userIdx: otherUser.idx,
        acceptedAt: new Date(),
      });

      await request(test.getServer())
        .delete(`/culture-content/request/${content.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(403);
    });

    it('Delete non-existent content', async () => {
      const loginUser = test.getLoginUsers().user2;
      const idx = 9999; // Non-existent content

      await request(test.getServer())
        .delete(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(404);
    });

    it('No token', async () => {
      const idx = 2;

      await request(test.getServer())
        .delete(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${null}`)
        .expect(401);
    });

    it('Accepted content', async () => {
      const loginUser = test.getLoginUsers().user1;
      const notAcceptedContent = await contentSeedHelper.seed({
        userIdx: loginUser.idx,
        acceptedAt: new Date(),
      });

      await request(test.getServer())
        .delete(`/culture-content/request/${notAcceptedContent.idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(409);
    });

    it('Invalid path parameter', async () => {
      const loginUser = test.getLoginUsers().user1;
      const idx = 'invalid idx'; // Invalid path parameter

      await request(test.getServer())
        .delete(`/culture-content/request/${idx}`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(400);
    });
  });

  describe('GET /culture-content/like/all', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;
      const otherUser = test.getLoginUsers().user2;

      const [content, secondContent, thirdContent] =
        await contentSeedHelper.seedAll([
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
          },
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
          },
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
          },
        ]);

      // like first content
      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      // like second content
      await request(test.getServer())
        .post(`/culture-content/${secondContent.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      const response = await request(test.getServer())
        .get('/culture-content/like/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({ onlyopen: false })
        .expect(200);

      const contentList: SummaryContentEntity[] = response.body.contentList;

      expect(contentList.map(({ idx }) => idx).sort()).toStrictEqual(
        [content.idx, secondContent.idx].sort(),
      );
    });

    it('Success with genre filtering', async () => {
      const loginUser = test.getLoginUsers().user1;
      const otherUser = test.getLoginUsers().user2;

      const [content, secondContent, thirdContent] =
        await contentSeedHelper.seedAll([
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
            genreIdx: GENRE.CONCERT,
          },
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
            genreIdx: GENRE.MUSICAL,
          },
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
            genreIdx: GENRE.POPUP_STORE,
          },
        ]);

      // like first content
      await request(test.getServer())
        .post(`/culture-content/${content.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      // like second content
      await request(test.getServer())
        .post(`/culture-content/${secondContent.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      const response = await request(test.getServer())
        .get('/culture-content/like/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({ onlyopen: false, genre: GENRE.CONCERT }) // genre filtering
        .expect(200);

      const contentList: SummaryContentEntity[] = response.body.contentList;

      expect(contentList.map(({ idx }) => idx).sort()).toStrictEqual(
        [content.idx].sort(),
      );
    });

    it('Success with onlyopen filtering', async () => {
      const loginUser = test.getLoginUsers().user1;
      const otherUser = test.getLoginUsers().user2;

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const [endContent, openContents, thirdContent] =
        await contentSeedHelper.seedAll([
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
            startDate: threeDaysAgo,
            endDate: threeDaysAgo, // end contents
          },
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
            startDate: threeDaysAgo,
            endDate: null, // open contents
          },
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
            startDate: threeDaysAgo,
            endDate: null, // open contents
          },
        ]);

      // like first content
      await request(test.getServer())
        .post(`/culture-content/${endContent.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      // like second content
      await request(test.getServer())
        .post(`/culture-content/${openContents.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      const response = await request(test.getServer())
        .get('/culture-content/like/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          onlyopen: true, // only open filtering
        })
        .expect(200);

      const contentList: SummaryContentEntity[] = response.body.contentList;

      expect(contentList.map(({ idx }) => idx).sort()).toStrictEqual(
        [openContents.idx].sort(),
      );
    });

    it('Success: orderby test', async () => {
      const loginUser = test.getLoginUsers().user1;
      const otherUser = test.getLoginUsers().user2;

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const [secondLikeContents, firstLikeContent, thirdContent] =
        await contentSeedHelper.seedAll([
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
          },
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
          },
          {
            userIdx: otherUser.idx,
            acceptedAt: new Date(),
          },
        ]);

      // like first content
      await request(test.getServer())
        .post(`/culture-content/${firstLikeContent.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      // like second content
      await request(test.getServer())
        .post(`/culture-content/${secondLikeContents.idx}/like`)
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      const response = await request(test.getServer())
        .get('/culture-content/like/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({ onlyopen: false })
        .expect(200);

      const contentList: SummaryContentEntity[] = response.body.contentList;

      expect(contentList.map(({ idx }) => idx)).toStrictEqual([
        secondLikeContents.idx, // 최근에 좋아요한 순서대로 가져옴
        firstLikeContent.idx,
      ]);
    });

    it('fail - no token', async () => {
      await request(test.getServer())
        .get('/culture-content/like/all')
        .query({ onlyopen: false })
        .expect(401);
    });

    it('fail - invalid onlyopen', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/like/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          onlyopen: null, // invalid only open
        })
        .expect(400);
    });

    it('fail - invalid genre', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/culture-content/like/all')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .query({
          onlyopen: false,
          genre: 100, // genre does not exist
        })
        .expect(400);
    });
  });
});
