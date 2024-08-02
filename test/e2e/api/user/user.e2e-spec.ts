import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../../src/app.module';
import { SignUpDto } from '../../../../src/api/user/dto/sign-up.dto';
import { Gender } from '../../../../src/api/user/model/Gender';
import { EmailJwtService } from '../../../../src/api/email-cert/email-jwt.service';
import { PrismaService } from '../../../../src/common/module/prisma/prisma.service';
import { SocialSignUpDto } from '../../../../src/api/user/dto/social-sign-up.dto';
import { SocialLoginJwtService } from '../../../../src/common/module/social-login-jwt/social-login-jwt.service';
import { SocialLoginUser } from '../../../../src/api/auth/model/social-login-user';
import { SocialProvider } from '../../../../src/api/auth/strategy/social-provider.enum';
import { UpdateProfileDto } from '../../../../src/api/user/dto/update-profile.dto';
import { EmailDuplicateCheckDto } from '../../../../src/api/user/dto/email-duplicate-check.dto';
import { NicknameDuplicateCheckDto } from '../../../../src/api/user/dto/nickname-duplicate-check.dto';
import { FindPwDto } from '../../../../src/api/user/dto/find-pw.dto';
import spyOn = jest.spyOn;
import { PrismaSetting } from '../../setup/prisma.setup';
import { AppGlobalSetting } from '../../setup/app-global.setup';
import { LoginSetting, TestLoginUsers } from '../../setup/login-user.setup';
import { ResetPwDto } from '../../../../src/api/user/dto/reset-pw.dto';
import { LoginDto } from '../../../../src/api/auth/dto/local-login.dto';

describe('User (e2e)', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  const prismaSetting = PrismaSetting.setup();

  let emailJwtService: EmailJwtService;
  let socialLoginJwtService: SocialLoginJwtService;

  let loginUsers: TestLoginUsers;

  beforeEach(async () => {
    await prismaSetting.BEGIN();

    appModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaSetting.getPrisma())
      .compile();
    app = appModule.createNestApplication();
    AppGlobalSetting.setup(app);
    await app.init();

    emailJwtService = appModule.get(EmailJwtService);
    socialLoginJwtService = appModule.get(SocialLoginJwtService);

    loginUsers = await LoginSetting.setup(loginUsers, app);
  });

  afterEach(async () => {
    prismaSetting.ROLLBACK();
    await appModule.close();
    await app.close();
  });

  describe('POST /user/local', () => {
    it('Signup success', async () => {
      const signUpDto: SignUpDto = {
        emailToken: 'sjdklfjasdf.sadfjklasdjf.sadfjklasdf',
        pw: 'pw123123**',
        nickname: 'jochong',
        gender: Gender.MALE,
        birth: 2002,
      };

      // 이메일 토큰이 정상이라고 가정
      const email = 'abc123@xxx.xxx';
      spyOn(emailJwtService, 'verify').mockResolvedValue(email);

      await request(app.getHttpServer())
        .post('/user/local')
        .send(signUpDto)
        .expect(200);
    });

    it('Invalid email token', async () => {
      const signUpDto: SignUpDto = {
        emailToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        pw: 'pw123123**',
        nickname: 'jochong',
        gender: Gender.MALE,
        birth: 2002,
      };

      await request(app.getHttpServer())
        .post('/user/local')
        .send(signUpDto)
        .expect(401);
    });

    it('Duplicate email', async () => {
      const sameEmail = 'abc123@xxx.xxx';
      spyOn(emailJwtService, 'verify').mockResolvedValue(sameEmail);
      const signUpDto: SignUpDto = {
        emailToken: 'sjdklfjasdf.sadfjklasdjf.sadfjklasdf',
        pw: 'pw123123**',
        nickname: 'jochong',
        gender: Gender.MALE,
        birth: 2002,
      };

      await request(app.getHttpServer())
        .post('/user/local')
        .send(signUpDto)
        .expect(200);

      spyOn(emailJwtService, 'verify').mockResolvedValue(sameEmail);
      const signUpDto2: SignUpDto = {
        emailToken: 'sjdklfjasdf.sadfjklasdjf.sadfjklasdf',
        pw: 'pw123123**',
        nickname: 'test',
        gender: Gender.MALE,
        birth: 2002,
      };

      await request(app.getHttpServer())
        .post('/user/local')
        .send(signUpDto2)
        .expect(409);
    });

    it('Duplicate nickname', async () => {
      const email = 'abc123@xxx.xxx';
      spyOn(emailJwtService, 'verify').mockResolvedValue(email);
      const signUpDto: SignUpDto = {
        emailToken: 'sjdklfjasdf.sadfjklasdjf.sadfjklasdf',
        pw: 'pw123123**',
        nickname: 'jochong',
        gender: Gender.MALE,
        birth: 2002,
      };

      await request(app.getHttpServer())
        .post('/user/local')
        .send(signUpDto)
        .expect(200);

      spyOn(emailJwtService, 'verify').mockResolvedValue('different@naver.com');
      const signUpDto2: SignUpDto = {
        emailToken: 'sjdklfjasdf.sadfjklasdjf.sadfjklasdf',
        pw: 'pw123123**',
        nickname: 'jochong',
        gender: Gender.MALE,
        birth: 2002,
      };

      await request(app.getHttpServer())
        .post('/user/local')
        .send(signUpDto2)
        .expect(409);
    });
  });

  describe('POST /user/social', () => {
    it('Social Signup success', async () => {
      const socialLoginUser: SocialLoginUser = {
        id: '123123123',
        provider: SocialProvider.KAKAO,
        nickname: 'jochong',
        email: 'test123@naver.com',
      };

      const socialSignUpDto: SocialSignUpDto = {
        birth: 2002,
        gender: Gender.MALE,
        nickname: 'jochong',
        token: await socialLoginJwtService.sign(socialLoginUser),
      };

      await request(app.getHttpServer())
        .post('/user/social')
        .send(socialSignUpDto)
        .expect(200);
    });

    it('Invalid social token', async () => {
      const socialSignUpDto: SocialSignUpDto = {
        birth: 2002,
        gender: Gender.MALE,
        nickname: 'jochong',
        token: 'this.is.invalidToken',
      };

      await request(app.getHttpServer())
        .post('/user/social')
        .send(socialSignUpDto)
        .expect(403);
    });

    it('Duplicate email', async () => {
      const sameEmail = 'test123@naver.com';

      const socialLoginUser: SocialLoginUser = {
        id: '123123123',
        provider: SocialProvider.KAKAO,
        nickname: 'jochong',
        email: sameEmail,
      };

      const socialSignUpDto: SocialSignUpDto = {
        birth: 2002,
        gender: Gender.MALE,
        nickname: 'jochong',
        token: await socialLoginJwtService.sign(socialLoginUser),
      };

      await request(app.getHttpServer())
        .post('/user/social')
        .send(socialSignUpDto)
        .expect(200);

      const socialLoginUser2: SocialLoginUser = {
        id: '123123123',
        provider: SocialProvider.KAKAO,
        nickname: 'jochong',
        email: sameEmail,
      };

      const socialSignUpDto2: SocialSignUpDto = {
        birth: 2002,
        gender: Gender.MALE,
        nickname: 'test',
        token: await socialLoginJwtService.sign(socialLoginUser2),
      };

      await request(app.getHttpServer())
        .post('/user/social')
        .send(socialSignUpDto2)
        .expect(409);
    });

    it('Duplicate email', async () => {
      const sameNickname = 'jochong';

      // First social login user
      const socialLoginUser: SocialLoginUser = {
        id: '123123123',
        provider: SocialProvider.KAKAO,
        nickname: 'kakaoUser1',
        email: 'another@xxxx.xxx',
      };

      const socialSignUpDto: SocialSignUpDto = {
        birth: 2002,
        gender: Gender.MALE,
        nickname: sameNickname,
        token: await socialLoginJwtService.sign(socialLoginUser),
      };

      await request(app.getHttpServer())
        .post('/user/social')
        .send(socialSignUpDto)
        .expect(200);

      // Second social login user with duplicated email
      const socialLoginUser2: SocialLoginUser = {
        id: '123123123',
        provider: SocialProvider.KAKAO,
        nickname: 'kakaoUser2',
        email: 'theother@gmail.com',
      };

      const socialSignUpDto2: SocialSignUpDto = {
        birth: 2002,
        gender: Gender.MALE,
        nickname: sameNickname, // Same nickname
        token: await socialLoginJwtService.sign(socialLoginUser2),
      };

      await request(app.getHttpServer())
        .post('/user/social')
        .send(socialSignUpDto2)
        .expect(409);
    });

    it('Duplicate sign up with local user email', async () => {
      const sameEmail = 'sameEmail@xxxx.xxx';

      // Local user
      const signUpDto: SignUpDto = {
        emailToken: 'sjdklfjasdf.sadfjklasdjf.sadfjklasdf',
        pw: 'pw123123**',
        nickname: 'jochong',
        gender: Gender.MALE,
        birth: 2002,
      };
      spyOn(emailJwtService, 'verify').mockResolvedValue(sameEmail);
      await request(app.getHttpServer())
        .post('/user/local')
        .send(signUpDto)
        .expect(200);

      // Social sign up with duplicated email
      const socialLoginUser: SocialLoginUser = {
        id: '123123123',
        provider: SocialProvider.KAKAO,
        nickname: 'jochong',
        email: sameEmail,
      };
      const socialSignUpDto: SocialSignUpDto = {
        birth: 2002,
        gender: Gender.MALE,
        nickname: 'jochong',
        token: await socialLoginJwtService.sign(socialLoginUser),
      };

      await request(app.getHttpServer())
        .post('/user/social')
        .send(socialSignUpDto)
        .expect(409);
    });
  });

  describe('GET /user/my', () => {
    it('Success', async () => {
      const loginUser = loginUsers.user1;

      await request(app.getHttpServer())
        .get('/user/my')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);
    });

    it('No login access token', async () => {
      await request(app.getHttpServer()).get('/user/my').expect(401);
    });

    it('Invalid login access token', async () => {
      const invalidToken = 'invalid.token';
      await request(app.getHttpServer())
        .get('/user/my')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });
  });

  describe('PUT /my/profile', () => {
    it('Success', async () => {
      const loginUser = loginUsers.user1;
      const updateDto: UpdateProfileDto = {
        nickname: 'jochong',
        gender: Gender.FEMALE,
        birth: 2001,
      };

      await request(app.getHttpServer())
        .put('/user/my/profile')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(updateDto)
        .expect(201);
    });

    it('No token', async () => {
      const updateDto: UpdateProfileDto = {
        nickname: 'jochong',
        gender: Gender.FEMALE,
        birth: 2001,
      };

      await request(app.getHttpServer())
        .put('/user/my/profile')
        .send(updateDto)
        .expect(401);
    });

    it('Duplicated nickname', async () => {
      const loginUser = loginUsers.user1;
      const updateDto: UpdateProfileDto = {
        nickname: 'user1', // Duplicated nickname
        gender: Gender.FEMALE,
        birth: 2001,
      };

      await request(app.getHttpServer())
        .put('/user/my/profile')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(updateDto)
        .expect(409);
    });
  });

  describe('POST /user/email/duplicate-check', () => {
    it('Success', async () => {
      const checkDto: EmailDuplicateCheckDto = {
        email: 'abc123@naver.com', // Non-duplicated email
      };

      await request(app.getHttpServer())
        .post('/user/email/duplicate-check')
        .send(checkDto)
        .expect(201);
    });

    it('Duplicated email', async () => {
      const checkDto: EmailDuplicateCheckDto = {
        email: 'user1@gmail.com', // non duplicated email
      };

      await request(app.getHttpServer())
        .post('/user/email/duplicate-check')
        .send(checkDto)
        .expect(409);
    });
  });

  describe('POST /user/nickname/duplicate-check', () => {
    it('Success', async () => {
      const checkDto: NicknameDuplicateCheckDto = {
        nickname: 'jochong', // Non-duplicated nickname
      };

      await request(app.getHttpServer())
        .post('/user/nickname/duplicate-check')
        .send(checkDto)
        .expect(201);
    });

    it('Duplicated nickname', async () => {
      const checkDto: NicknameDuplicateCheckDto = {
        nickname: 'user1', // duplicated nickname
      };

      await request(app.getHttpServer())
        .post('/user/nickname/duplicate-check')
        .send(checkDto)
        .expect(409);
    });
  });

  describe('POST /user/pw/find', () => {
    it('Success', async () => {
      const findPwDto: FindPwDto = {
        pw: 'myPw1234~!@',
        emailToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      };

      // 유효한 토큰이라 가정
      spyOn(emailJwtService, 'verify').mockResolvedValue('user1@gmail.com');

      await request(app.getHttpServer())
        .post('/user/pw/find')
        .send(findPwDto)
        .expect(201);
    });

    it('Invalid token', async () => {
      const findPwDto: FindPwDto = {
        pw: 'mypw1234~!@',
        emailToken: 'invalid.token', // Invalid token
      };

      await request(app.getHttpServer()).post('/user/pw/find').send(findPwDto);
      expect(403);
    });
  });

  describe('POST /user/pw/reset', () => {
    it('Success', async () => {
      const loginUser = loginUsers.user1;

      const resetPwDto: ResetPwDto = {
        currPw: 'aa12341234**',
        resetPw: 'abc123!@',
      };

      await request(app.getHttpServer())
        .post('/user/pw/reset')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(resetPwDto)
        .expect(201);

      const loginDto: LoginDto = {
        email: 'user1@gmail.com',
        pw: resetPwDto.resetPw,
      };

      await request(app.getHttpServer())
        .post('/auth/local')
        .send(loginDto)
        .expect(200);
    });

    it('Wrong curr password', async () => {
      const loginUser = loginUsers.user1;
      const resetPwDto: ResetPwDto = {
        currPw: 'wrong password',
        resetPw: 'abc123!@',
      };

      await request(app.getHttpServer())
        .post('/user/pw/reset')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(resetPwDto)
        .expect(400);
    });

    it('No token', async () => {
      const resetPwDto: ResetPwDto = {
        currPw: 'aa12341234**',
        resetPw: 'aa12341234**',
      };

      await request(app.getHttpServer())
        .post('/user/pw/reset')
        .send(resetPwDto)
        .expect(401);
    });
  });

  describe('DELETE /user', () => {
    it('Success', async () => {
      const loginUser = loginUsers.user2;

      await request(app.getHttpServer())
        .delete('/user')
        .send({
          type: 1,
          contents: '삭제합니다.',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post('/auth/local')
        .send({
          email: 'user2@gmail.com',
          pw: 'aa12341234**',
        })
        .expect(401);
    });

    it('Success with no contents', async () => {
      const loginUser = loginUsers.user2;

      await request(app.getHttpServer())
        .delete('/user')
        .send({
          type: 1,
          contents: '삭제합니다.',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post('/auth/local')
        .send({
          email: 'user2@gmail.com',
          pw: 'aa12341234**',
        })
        .expect(401);
    });
  });
});
