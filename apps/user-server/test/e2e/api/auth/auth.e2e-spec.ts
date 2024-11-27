import * as request from 'supertest';
import { LoginDto } from '../../../../src/api/auth/dto/local-login.dto';
import { KakaoLoginStrategy } from '../../../../src/api/auth/strategy/kakao/kakao-login.strategy';
import { SocialLoginUser } from '../../../../src/api/auth/model/social-login-user';
import { SocialProvider } from '../../../../src/api/auth/strategy/social-provider.enum';
import { TestHelper } from '../../setup/test.helper';
import { PrismaProvider } from '../../../../../../libs/modules/src';

describe('Auth (e2e)', () => {
  const test = TestHelper.create();

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
  });

  describe('POST /auth/local', () => {
    it('Success', async () => {
      const loginDto: LoginDto = {
        email: 'user1@gmail.com',
        pw: 'aa12341234**',
      };

      await request(test.getServer())
        .post('/auth/local')
        .send(loginDto)
        .expect(200);
    });

    it('Register last login time test', async () => {
      const loginDto: LoginDto = {
        email: 'user1@gmail.com',
        pw: 'aa12341234**',
      };

      await request(test.getServer())
        .post('/auth/local')
        .send(loginDto)
        .expect(200);

      const loginUser = await test.get(PrismaProvider).user.findFirst({
        where: {
          email: loginDto.email,
        },
        select: {
          loginAt: true,
        },
      });

      expect(loginUser?.loginAt).toBeDefined();
    });

    it('Non-existent email', async () => {
      const loginDto: LoginDto = {
        email: 'nonExist@xxxx.xxx', // Non-existent email
        pw: 'aa12341234**',
      };

      await request(test.getServer())
        .post('/auth/local')
        .send(loginDto)
        .expect(401);
    });

    it('Wrong password', async () => {
      const loginDto: LoginDto = {
        email: 'user1@gmail.com',
        pw: 'wrongPassword', // Wrong password
      };

      await request(test.getServer())
        .post('/auth/local')
        .send(loginDto)
        .expect(401);
    });

    it('Suspended user', async () => {
      const loginDto: LoginDto = {
        email: 'user3@gmail.com',
        pw: 'aa12341234**', // Wrong password
      };

      await request(test.getServer())
        .post('/auth/local')
        .send(loginDto)
        .expect(418);
    });

    it('Social user login', async () => {
      const loginDto: LoginDto = {
        email: 'kakao1@daum.net',
        pw: 'aa12341234**', // Wrong password
      };

      await request(test.getServer())
        .post('/auth/local')
        .send(loginDto)
        .expect(401);
    });
  });

  describe('GET /auth/:provider', () => {
    it('Success', async () => {
      await request(test.getServer()).get('/auth/kakao').expect(302);
    });

    it('Invalid provider', async () => {
      const invalidProvider = 'invalidProvider';

      await request(test.getServer())
        .get(`/auth/${invalidProvider}`)
        .expect(400);
    });
  });

  describe('GET /auth/:provider/callback', () => {
    it('Success - first login', async () => {
      const socialLoginUser: SocialLoginUser = {
        id: '111111111', // First login
        provider: SocialProvider.KAKAO,
        nickname: 'jochong',
        email: 'test123@naver.com',
      };

      const kakaoLoginStrategy = test.get(KakaoLoginStrategy);

      jest
        .spyOn(kakaoLoginStrategy, 'getSocialLoginUser')
        .mockResolvedValue(socialLoginUser);

      await request(test.getServer()).get('/auth/kakao/callback').expect(302);
    });

    it('Success - second login', async () => {
      const socialLoginUser: SocialLoginUser = {
        id: '12312412', // Second login
        provider: SocialProvider.KAKAO,
        nickname: 'jochong',
        email: 'kakao1@daum.net',
      };

      const kakaoLoginStrategy = test.get(KakaoLoginStrategy);

      jest
        .spyOn(kakaoLoginStrategy, 'getSocialLoginUser')
        .mockResolvedValue(socialLoginUser);

      const response = await request(test.getServer())
        .get('/auth/kakao/callback')
        .expect(302);

      expect(response.headers.location).toContain('/social-login-complete');
    });

    it('Success - changed email', async () => {
      const socialLoginUser: SocialLoginUser = {
        id: '12312412', // Second login
        provider: SocialProvider.KAKAO,
        nickname: 'jochong',
        email: 'test123@gmail.com',
      };

      const kakaoLoginStrategy = test.get(KakaoLoginStrategy);

      jest
        .spyOn(kakaoLoginStrategy, 'getSocialLoginUser')
        .mockResolvedValue(socialLoginUser);

      const response = await request(test.getServer())
        .get('/auth/kakao/callback')
        .expect(302);

      expect(response.headers.location).toContain('/social-login-complete');
    });

    it('Duplicated email', async () => {
      const socialLoginUser: SocialLoginUser = {
        id: '123123123', // First login
        provider: SocialProvider.KAKAO,
        nickname: 'jochong',
        email: 'user1@gmail.com',
      };

      const kakaoLoginStrategy = test.get(KakaoLoginStrategy);

      jest
        .spyOn(kakaoLoginStrategy, 'getSocialLoginUser')
        .mockResolvedValue(socialLoginUser);

      const response = await request(test.getServer())
        .get('/auth/kakao/callback')
        .expect(302);

      expect(response.headers.location).toContain(
        '/social-login-complete/duplicated-email',
      );
    });

    it('Error occurred from external API', async () => {
      const kakaoLoginStrategy = test.get(KakaoLoginStrategy);

      jest
        .spyOn(kakaoLoginStrategy, 'getSocialLoginUser')
        .mockImplementation(async () => {
          throw new Error('External Error');
        });

      const response = await request(test.getServer())
        .get('/auth/kakao/callback')
        .expect(302);

      expect(response.headers.location).toContain(
        '/social-login-complete/error',
      );
    });

    it('Invalid provider', async () => {
      const invalidProvider = 'invalidProvider';

      request(test.getServer()).get(`/auth/${invalidProvider}`).expect(400);
    });
  });

  describe('POST /auth/access-token', () => {
    it('Success', async () => {
      // 로그인
      const response = await request(test.getServer())
        .post('/auth/local')
        .send({
          email: 'user1@gmail.com',
          pw: 'aa12341234**',
        });
      const refreshTokenCookie = response.headers['set-cookie'][0];

      await request(test.getServer())
        .post('/auth/access-token')
        .set('Cookie', refreshTokenCookie)
        .expect(200);
    });

    it('No refresh token', async () => {
      await request(test.getServer()).post('/auth/access-token').expect(401);
    });

    it('No refresh token', async () => {
      await request(test.getServer()).post('/auth/access-token').expect(401);
    });

    it('Using an already used refresh token - but ok', async () => {
      // 로그인
      const response = await request(test.getServer())
        .post('/auth/local')
        .send({
          email: 'user1@gmail.com',
          pw: 'aa12341234**',
        });
      const refreshTokenCookie = response.headers['set-cookie'][0];

      await request(test.getServer())
        .post('/auth/access-token')
        .set('Cookie', refreshTokenCookie)
        .expect(200);

      // 다시 사용
      await request(test.getServer())
        .post('/auth/access-token')
        .set('Cookie', refreshTokenCookie)
        .expect(200);
    });
  });

  describe('DELETE /auth', () => {
    it('Success with cookie', async () => {
      // 로그인
      const response = await request(test.getServer())
        .post('/auth/local')
        .send({
          email: 'user1@gmail.com',
          pw: 'aa12341234**',
        });
      const refreshTokenCookie = response.headers['set-cookie'][0];

      await request(test.getServer())
        .delete('/auth')
        .set('Cookie', refreshTokenCookie)
        .expect(201);
    });

    it('Success with no cookie', async () => {
      await request(test.getServer()).delete('/auth').expect(201);
    });

    it('Delete last login time', async () => {
      const loginDto: LoginDto = {
        email: 'user1@gmail.com',
        pw: 'aa12341234**',
      };

      const response = await request(test.getServer())
        .post('/auth/local')
        .send(loginDto);

      const loginUser = await test.get(PrismaProvider).user.findFirst({
        where: {
          email: loginDto.email,
        },
        select: {
          loginAt: true,
        },
      });

      expect(loginUser?.loginAt).toBeDefined();

      const refreshTokenCookie = response.headers['set-cookie'][0];

      await request(test.getServer())
        .delete('/auth')
        .set('Cookie', refreshTokenCookie)
        .expect(201);

      const logoutUser = await test.get(PrismaProvider).user.findFirst({
        where: {
          email: loginDto.email,
        },
        select: {
          loginAt: true,
        },
      });

      expect(logoutUser?.loginAt).toBeNull();
    });
  });
});
