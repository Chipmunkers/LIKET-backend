import { UpdateUserInterestDto } from 'apps/user-server/src/api/user-interest/dto/update-interest.dto';
import { AppModule } from 'apps/user-server/src/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import * as request from 'supertest';

describe('User Interest (e2e)', () => {
  const test = TestHelper.create(AppModule);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('POST /user-interest', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      const dto: UpdateUserInterestDto = {
        locationList: [],
        styleList: [],
        genreList: [],
        ageList: [],
      };

      await request(test.getServer())
        .post('/user-interest')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(dto)
        .expect(200);
    });
  });

  it('No token', async () => {
    const dto: UpdateUserInterestDto = {
      locationList: [],
      styleList: [],
      genreList: [],
      ageList: [],
    };

    await request(test.getServer())
      .post('/user-interest')
      .send(dto)
      .expect(401);
  });

  it('Update test', async () => {
    const loginUser = test.getLoginUsers().user1;

    const dto: UpdateUserInterestDto = {
      locationList: ['11', '12'],
      styleList: [1, 2],
      genreList: [3],
      ageList: [4, 5],
    };

    await request(test.getServer())
      .post('/user-interest')
      .set('Authorization', `Bearer ${loginUser.accessToken}`)
      .send(dto)
      .expect(200);

    // interest style 목록
    const interestStyleList = await test
      .getPrisma()
      .interestStyle.findMany({ where: { userIdx: loginUser.idx } });
    expect(
      interestStyleList.map((style) => style.styleIdx).sort(),
    ).toStrictEqual(dto.styleList.sort());

    // interest age 목록
    const interestAgeList = await test
      .getPrisma()
      .interestAge.findMany({ where: { userIdx: loginUser.idx } });
    expect(interestAgeList.map((age) => age.ageIdx).sort()).toStrictEqual(
      dto.ageList.sort(),
    );

    // interest genre 목록
    const genreList = await test
      .getPrisma()
      .interestGenre.findMany({ where: { userIdx: loginUser.idx } });
    expect(genreList.map((genre) => genre.genreIdx).sort()).toStrictEqual(
      dto.genreList.sort(),
    );

    // location 목록
    const locationList = await test
      .getPrisma()
      .interestLocation.findMany({ where: { userIdx: loginUser.idx } });
    expect(locationList.map((location) => location.bCode).sort()).toStrictEqual(
      dto.locationList.sort(),
    );
  });

  it('Update test 2', async () => {
    const loginUser = test.getLoginUsers().user1;

    const dto: UpdateUserInterestDto = {
      locationList: ['11', '12', '13', '14'],
      styleList: [1, 2, 3, 4],
      genreList: [3, 1],
      ageList: [4],
    };

    await request(test.getServer())
      .post('/user-interest')
      .set('Authorization', `Bearer ${loginUser.accessToken}`)
      .send(dto)
      .expect(200);

    // interest style 목록
    const interestStyleList = await test
      .getPrisma()
      .interestStyle.findMany({ where: { userIdx: loginUser.idx } });
    expect(
      interestStyleList.map((style) => style.styleIdx).sort(),
    ).toStrictEqual(dto.styleList.sort());

    // interest age 목록
    const interestAgeList = await test
      .getPrisma()
      .interestAge.findMany({ where: { userIdx: loginUser.idx } });
    expect(interestAgeList.map((age) => age.ageIdx).sort()).toStrictEqual(
      dto.ageList.sort(),
    );

    // interest genre 목록
    const genreList = await test
      .getPrisma()
      .interestGenre.findMany({ where: { userIdx: loginUser.idx } });
    expect(genreList.map((genre) => genre.genreIdx).sort()).toStrictEqual(
      dto.genreList.sort(),
    );

    // location 목록
    const locationList = await test
      .getPrisma()
      .interestLocation.findMany({ where: { userIdx: loginUser.idx } });
    expect(locationList.map((location) => location.bCode).sort()).toStrictEqual(
      dto.locationList.sort(),
    );

    const dto2: UpdateUserInterestDto = {
      locationList: [],
      styleList: [],
      genreList: [],
      ageList: [],
    };

    await request(test.getServer())
      .post('/user-interest')
      .set('Authorization', `Bearer ${loginUser.accessToken}`)
      .send(dto2)
      .expect(200);

    // interest style 목록
    const interestStyleList2 = await test
      .getPrisma()
      .interestStyle.findMany({ where: { userIdx: loginUser.idx } });
    expect(
      interestStyleList2.map((style) => style.styleIdx).sort(),
    ).toStrictEqual(dto2.styleList.sort());

    // interest age 목록
    const interestAgeList2 = await test
      .getPrisma()
      .interestAge.findMany({ where: { userIdx: loginUser.idx } });
    expect(interestAgeList2.map((age) => age.ageIdx).sort()).toStrictEqual(
      dto2.ageList.sort(),
    );

    // interest genre 목록
    const genreList2 = await test
      .getPrisma()
      .interestGenre.findMany({ where: { userIdx: loginUser.idx } });
    expect(genreList2.map((genre) => genre.genreIdx).sort()).toStrictEqual(
      dto2.genreList.sort(),
    );

    // location 목록
    const locationList2 = await test
      .getPrisma()
      .interestLocation.findMany({ where: { userIdx: loginUser.idx } });
    expect(
      locationList2.map((location) => location.bCode).sort(),
    ).toStrictEqual(dto2.locationList.sort());
  });

  it('Fail to validate - null genreList', async () => {
    const loginUser = test.getLoginUsers().user1;

    const dto = {
      genreList: null,
      locationList: ['12', '13'],
      styleList: [1, 2, 3, 4],
      ageList: [4],
    };

    await request(test.getServer())
      .post('/user-interest')
      .set('Authorization', `Bearer ${loginUser.accessToken}`)
      .send(dto)
      .expect(400);
  });

  it('Fail to validate - null styleList', async () => {
    const loginUser = test.getLoginUsers().user1;

    const dto = {
      genreList: [3, 1],
      locationList: ['12', '13'],
      styleList: null,
      ageList: [4],
    };

    await request(test.getServer())
      .post('/user-interest')
      .set('Authorization', `Bearer ${loginUser.accessToken}`)
      .send(dto)
      .expect(400);
  });

  it('Fail to validate - null ageList', async () => {
    const loginUser = test.getLoginUsers().user1;

    const dto = {
      genreList: [3, 1],
      locationList: ['12', '13'],
      styleList: [1, 2],
      ageList: null,
    };

    await request(test.getServer())
      .post('/user-interest')
      .set('Authorization', `Bearer ${loginUser.accessToken}`)
      .send(dto)
      .expect(400);
  });
});
