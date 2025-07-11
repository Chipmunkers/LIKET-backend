import * as request from 'supertest';
import { AppModule } from '../../../../src/app.module';
import { SignUpDto } from '../../../../src/api/user/dto/sign-up.dto';
import { Gender } from '../../../../src/api/user/model/Gender';
import { EmailJwtService } from '../../../../src/api/email-cert/email-jwt.service';
import { UpdateProfileDto } from '../../../../src/api/user/dto/update-profile.dto';
import { EmailDuplicateCheckDto } from '../../../../src/api/user/dto/email-duplicate-check.dto';
import { FindPwDto } from '../../../../src/api/user/dto/find-pw.dto';
import spyOn = jest.spyOn;
import { ResetPwDto } from '../../../../src/api/user/dto/reset-pw.dto';
import { LoginDto } from '../../../../src/api/auth/dto/local-login.dto';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';
import { WithdrawalReasonCoreService } from 'libs/core/withdrawal-reason/withdrawal-reason.service';
import { WithdrawalReasonCoreRepository } from 'libs/core/withdrawal-reason/withdrawal-reason-core.repository';

describe('User (e2e)', () => {
  const test = TestHelper.create(AppModule);

  beforeEach(async () => {
    await test.init();
  });

  afterEach(async () => {
    await test.destroy();
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

      const emailJwtService = test.get(EmailJwtService);

      // 이메일 토큰이 정상이라고 가정
      const email = 'abc123@xxx.xxx';
      spyOn(emailJwtService, 'verify').mockResolvedValue(email);

      await request(test.getServer())
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

      await request(test.getServer())
        .post('/user/local')
        .send(signUpDto)
        .expect(401);
    });

    it('Duplicate email', async () => {
      const sameEmail = 'user1@gmail.com';

      const emailJwtService = test.get(EmailJwtService);

      spyOn(emailJwtService, 'verify').mockResolvedValue(sameEmail);
      const signUpDto: SignUpDto = {
        emailToken: 'sjdklfjasdf.sadfjklasdjf.sadfjklasdf',
        pw: 'pw123123**',
        nickname: 'asdf',
        gender: Gender.MALE,
        birth: 2002,
      };

      await request(test.getServer())
        .post('/user/local')
        .send(signUpDto)
        .expect(409);
    });

    it('Duplicate nickname - but ok', async () => {
      const email = 'abc123@xxx.xxx';

      const emailJwtService = test.get(EmailJwtService);

      spyOn(emailJwtService, 'verify').mockResolvedValue(email);
      const signUpDto: SignUpDto = {
        emailToken: 'sjdklfjasdf.sadfjklasdjf.sadfjklasdf',
        pw: 'pw123123**',
        nickname: 'jochong',
        gender: Gender.MALE,
        birth: 2002,
      };

      await request(test.getServer())
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

      await request(test.getServer())
        .post('/user/local')
        .send(signUpDto2)
        .expect(200);
    });
  });

  /**
   * @deprecated
   */
  // describe('POST /user/social', () => {
  //   it('Social Signup success', async () => {
  //     const socialLoginUser: SocialLoginUser = {
  //       id: '123123123',
  //       provider: SocialProvider.KAKAO,
  //       nickname: 'jochong',
  //       email: 'test123@naver.com',
  //     };

  //     const socialLoginJwtService = test.get(SocialLoginJwtService);

  //     const socialSignUpDto: SocialSignUpDto = {
  //       birth: 2002,
  //       gender: Gender.MALE,
  //       nickname: 'jochong',
  //       token: await socialLoginJwtService.sign(socialLoginUser),
  //     };

  //     await request(test.getServer())
  //       .post('/user/social')
  //       .send(socialSignUpDto)
  //       .expect(200);
  //   });

  //   it('Invalid social token', async () => {
  //     const socialSignUpDto: SocialSignUpDto = {
  //       birth: 2002,
  //       gender: Gender.MALE,
  //       nickname: 'jochong',
  //       token: 'this.is.invalidToken',
  //     };

  //     await request(test.getServer())
  //       .post('/user/social')
  //       .send(socialSignUpDto)
  //       .expect(403);
  //   });

  //   it('Duplicate email', async () => {
  //     const sameEmail = 'test123@naver.com';

  //     const socialLoginUser: SocialLoginUser = {
  //       id: '123123123',
  //       provider: SocialProvider.KAKAO,
  //       nickname: 'jochong',
  //       email: sameEmail,
  //     };

  //     const socialLoginJwtService = test.get(SocialLoginJwtService);

  //     const socialSignUpDto: SocialSignUpDto = {
  //       birth: 2002,
  //       gender: Gender.MALE,
  //       nickname: 'jochong',
  //       token: await socialLoginJwtService.sign(socialLoginUser),
  //     };

  //     await request(test.getServer())
  //       .post('/user/social')
  //       .send(socialSignUpDto)
  //       .expect(200);

  //     const socialLoginUser2: SocialLoginUser = {
  //       id: '123123123',
  //       provider: SocialProvider.KAKAO,
  //       nickname: 'jochong',
  //       email: sameEmail,
  //     };

  //     const socialSignUpDto2: SocialSignUpDto = {
  //       birth: 2002,
  //       gender: Gender.MALE,
  //       nickname: 'test',
  //       token: await socialLoginJwtService.sign(socialLoginUser2),
  //     };

  //     await request(test.getServer())
  //       .post('/user/social')
  //       .send(socialSignUpDto2)
  //       .expect(409);
  //   });

  //   it('Duplicate nickname - but ok', async () => {
  //     const sameNickname = 'jochong';

  //     // First social login user
  //     const socialLoginUser: SocialLoginUser = {
  //       id: '123123123',
  //       provider: SocialProvider.KAKAO,
  //       nickname: 'kakaoUser1',
  //       email: 'another@xxxx.xxx',
  //     };

  //     const socialLoginJwtService = test.get(SocialLoginJwtService);

  //     const socialSignUpDto: SocialSignUpDto = {
  //       birth: 2002,
  //       gender: Gender.MALE,
  //       nickname: sameNickname,
  //       token: await socialLoginJwtService.sign(socialLoginUser),
  //     };

  //     await request(test.getServer())
  //       .post('/user/social')
  //       .send(socialSignUpDto)
  //       .expect(200);

  //     // Second social login user with duplicated email
  //     const socialLoginUser2: SocialLoginUser = {
  //       id: '123123123',
  //       provider: SocialProvider.KAKAO,
  //       nickname: 'kakaoUser2',
  //       email: 'theother@gmail.com',
  //     };

  //     const socialSignUpDto2: SocialSignUpDto = {
  //       birth: 2002,
  //       gender: Gender.MALE,
  //       nickname: sameNickname, // Same nickname
  //       token: await socialLoginJwtService.sign(socialLoginUser2),
  //     };

  //     await request(test.getServer())
  //       .post('/user/social')
  //       .send(socialSignUpDto2)
  //       .expect(200);
  //   });

  //   it('Duplicate sign up with local user email', async () => {
  //     const sameEmail = 'sameEmail@xxxx.xxx';

  //     // Local user
  //     const signUpDto: SignUpDto = {
  //       emailToken: 'sjdklfjasdf.sadfjklasdjf.sadfjklasdf',
  //       pw: 'pw123123**',
  //       nickname: 'jochong',
  //       gender: Gender.MALE,
  //       birth: 2002,
  //     };

  //     const emailJwtService = test.get(EmailJwtService);

  //     spyOn(emailJwtService, 'verify').mockResolvedValue(sameEmail);
  //     await request(test.getServer())
  //       .post('/user/local')
  //       .send(signUpDto)
  //       .expect(200);

  //     // Social sign up with duplicated email
  //     const socialLoginUser: SocialLoginUser = {
  //       id: '123123123',
  //       provider: SocialProvider.KAKAO,
  //       nickname: 'jochong',
  //       email: sameEmail,
  //     };

  //     const socialLoginJwtService = test.get(SocialLoginJwtService);

  //     const socialSignUpDto: SocialSignUpDto = {
  //       birth: 2002,
  //       gender: Gender.MALE,
  //       nickname: 'jochong',
  //       token: await socialLoginJwtService.sign(socialLoginUser),
  //     };

  //     await request(test.getServer())
  //       .post('/user/social')
  //       .send(socialSignUpDto)
  //       .expect(409);
  //   });
  // });

  describe('GET /user/my', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      await request(test.getServer())
        .get('/user/my')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(200);
    });

    it('No login access token', async () => {
      await request(test.getServer()).get('/user/my').expect(401);
    });

    it('Invalid login access token', async () => {
      const invalidToken = 'invalid.token';
      await request(test.getServer())
        .get('/user/my')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);
    });
  });

  describe('PUT /user/my/profile-img', () => {
    it('Success - change new profile img', async () => {
      const loginUser = test.getLoginUsers().user1;

      const beforeUpdateUser = await test.getPrisma().user.findUniqueOrThrow({
        where: {
          idx: loginUser.idx,
        },
      });

      const newProfileImgPath = '/new-path/new-img.0001.png';
      expect(beforeUpdateUser.profileImgPath).not.toBe(newProfileImgPath);

      await request(test.getServer())
        .put('/user/my/profile-img')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          profileImg: newProfileImgPath,
        });

      const afterUpdateUser = await test.getPrisma().user.findUniqueOrThrow({
        where: {
          idx: loginUser.idx,
        },
      });

      expect(beforeUpdateUser.idx).toBe(afterUpdateUser.idx);
      expect(beforeUpdateUser.nickname).toBe(afterUpdateUser.nickname);
      expect(beforeUpdateUser.email).toBe(afterUpdateUser.email);
      expect(beforeUpdateUser.gender).toBe(afterUpdateUser.gender);
      expect(beforeUpdateUser.birth).toBe(afterUpdateUser.birth);
      expect(beforeUpdateUser.isAdmin).toBe(afterUpdateUser.isAdmin);
      expect(beforeUpdateUser.provider).toBe(afterUpdateUser.provider);
      expect(beforeUpdateUser.pw).toBe(afterUpdateUser.pw);
      expect(afterUpdateUser.profileImgPath).toBe(newProfileImgPath);
    });

    it('Success - change null img', async () => {
      const loginUser = test.getLoginUsers().user1;

      const beforeUpdateUser = await test.getPrisma().user.findUniqueOrThrow({
        where: {
          idx: loginUser.idx,
        },
      });

      const newProfileImgPath = '/new-path/new-img.0001.png';
      expect(beforeUpdateUser.profileImgPath).not.toBe(newProfileImgPath);

      await request(test.getServer())
        .put('/user/my/profile-img')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({
          profileImg: newProfileImgPath,
        });

      const afterUpdateUser = await test.getPrisma().user.findUniqueOrThrow({
        where: {
          idx: loginUser.idx,
        },
      });

      expect(beforeUpdateUser.idx).toBe(afterUpdateUser.idx);
      expect(beforeUpdateUser.nickname).toBe(afterUpdateUser.nickname);
      expect(beforeUpdateUser.email).toBe(afterUpdateUser.email);
      expect(beforeUpdateUser.gender).toBe(afterUpdateUser.gender);
      expect(beforeUpdateUser.birth).toBe(afterUpdateUser.birth);
      expect(beforeUpdateUser.isAdmin).toBe(afterUpdateUser.isAdmin);
      expect(beforeUpdateUser.provider).toBe(afterUpdateUser.provider);
      expect(beforeUpdateUser.pw).toBe(afterUpdateUser.pw);
      expect(afterUpdateUser.profileImgPath).toBe(newProfileImgPath);

      // 다시 프로필 이미지 삭제
      await request(test.getServer())
        .put('/user/my/profile-img')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send({});

      const afterUpdateProfileImgToNullUser = await test
        .getPrisma()
        .user.findUniqueOrThrow({
          where: {
            idx: loginUser.idx,
          },
        });

      expect(afterUpdateProfileImgToNullUser.idx).toBe(afterUpdateUser.idx);
      expect(afterUpdateProfileImgToNullUser.nickname).toBe(
        afterUpdateUser.nickname,
      );
      expect(afterUpdateProfileImgToNullUser.email).toBe(afterUpdateUser.email);
      expect(afterUpdateProfileImgToNullUser.gender).toBe(
        afterUpdateUser.gender,
      );
      expect(afterUpdateProfileImgToNullUser.birth).toBe(afterUpdateUser.birth);
      expect(afterUpdateProfileImgToNullUser.isAdmin).toBe(
        afterUpdateUser.isAdmin,
      );
      expect(afterUpdateProfileImgToNullUser.provider).toBe(
        afterUpdateUser.provider,
      );
      expect(afterUpdateProfileImgToNullUser.pw).toBe(afterUpdateUser.pw);
      expect(afterUpdateProfileImgToNullUser.profileImgPath).toBeNull();
    });
  });

  describe('PUT /my/profile', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;
      const updateDto: UpdateProfileDto = {
        nickname: 'jochong',
        gender: Gender.FEMALE,
        birth: 2001,
      };

      const userBeforeUpdate = await test.getPrisma().user.findUniqueOrThrow({
        where: { idx: loginUser.idx },
      });

      expect(userBeforeUpdate.nickname).not.toBe(updateDto.nickname);
      expect(userBeforeUpdate.gender).not.toBe(updateDto.gender);
      expect(userBeforeUpdate.birth).not.toBe(updateDto.birth);

      await request(test.getServer())
        .put('/user/my/profile')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(updateDto)
        .expect(201);

      const userAfterUpdate = await test.getPrisma().user.findUniqueOrThrow({
        where: { idx: loginUser.idx },
      });

      expect(userAfterUpdate.idx).toBe(userBeforeUpdate.idx);
      expect(userAfterUpdate.nickname).toBe(updateDto.nickname);
      expect(userAfterUpdate.email).toBe(userBeforeUpdate.email);
      expect(userAfterUpdate.gender).toBe(updateDto.gender);
      expect(userAfterUpdate.birth).toBe(updateDto.birth);
      expect(userAfterUpdate.isAdmin).toBe(userBeforeUpdate.isAdmin);
      expect(userAfterUpdate.provider).toBe(userBeforeUpdate.provider);
      expect(userAfterUpdate.pw).toBe(userBeforeUpdate.pw);
      expect(userAfterUpdate.profileImgPath).toBe(
        userBeforeUpdate.profileImgPath,
      );
    });

    it('No token', async () => {
      const updateDto: UpdateProfileDto = {
        nickname: 'jochong',
        gender: Gender.FEMALE,
        birth: 2001,
      };

      await request(test.getServer())
        .put('/user/my/profile')
        .send(updateDto)
        .expect(401);
    });

    it('Duplicated nickname - but ok', async () => {
      const loginUser = test.getLoginUsers().user1;
      const updateDto: UpdateProfileDto = {
        nickname: 'user1', // Duplicated nickname
        gender: Gender.FEMALE,
        birth: 2001,
      };

      await request(test.getServer())
        .put('/user/my/profile')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(updateDto)
        .expect(201);
    });
  });

  describe('POST /user/email/duplicate-check', () => {
    it('Success', async () => {
      const checkDto: EmailDuplicateCheckDto = {
        email: 'abc123@naver.com', // Non-duplicated email
      };

      await request(test.getServer())
        .post('/user/email/duplicate-check')
        .send(checkDto)
        .expect(201);
    });

    it('Duplicated email', async () => {
      const checkDto: EmailDuplicateCheckDto = {
        email: 'user1@gmail.com', // non duplicated email
      };

      await request(test.getServer())
        .post('/user/email/duplicate-check')
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

      const emailJwtService = test.get(EmailJwtService);

      // 유효한 토큰이라 가정
      spyOn(emailJwtService, 'verify').mockResolvedValue('user1@gmail.com');

      await request(test.getServer())
        .post('/user/pw/find')
        .send(findPwDto)
        .expect(201);
    });

    it('Invalid token', async () => {
      const findPwDto: FindPwDto = {
        pw: 'mypw1234~!@',
        emailToken: 'invalid.token', // Invalid token
      };

      await request(test.getServer()).post('/user/pw/find').send(findPwDto);
      expect(403);
    });
  });

  describe('POST /user/pw/reset', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user1;

      const resetPwDto: ResetPwDto = {
        currPw: 'aa12341234**',
        resetPw: 'abc123!@',
      };

      await request(test.getServer())
        .post('/user/pw/reset')
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .send(resetPwDto)
        .expect(201);

      const loginDto: LoginDto = {
        email: 'user1@gmail.com',
        pw: resetPwDto.resetPw,
      };

      await request(test.getServer())
        .post('/auth/local')
        .send(loginDto)
        .expect(200);
    });

    it('Wrong curr password', async () => {
      const loginUser = test.getLoginUsers().user1;
      const resetPwDto: ResetPwDto = {
        currPw: 'wrong password',
        resetPw: 'abc123!@',
      };

      await request(test.getServer())
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

      await request(test.getServer())
        .post('/user/pw/reset')
        .send(resetPwDto)
        .expect(401);
    });
  });

  describe('DELETE /user', () => {
    it('Success', async () => {
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .delete('/user')
        .send({
          type: 1,
          contents: '삭제합니다.',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(test.getServer())
        .post('/auth/local')
        .send({
          email: 'user2@gmail.com',
          pw: 'aa12341234**',
        })
        .expect(401);
    });

    it('Success with no contents', async () => {
      const loginUser = test.getLoginUsers().user2;

      await request(test.getServer())
        .delete('/user')
        .send({
          type: 1,
          contents: '삭제합니다.',
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(201);

      await request(test.getServer())
        .post('/auth/local')
        .send({
          email: 'user2@gmail.com',
          pw: 'aa12341234**',
        })
        .expect(401);
    });

    it('Fail - transaction test', async () => {
      const loginUser = test.getLoginUsers().user2;

      const withdrawalCoreRepository = test.get(WithdrawalReasonCoreRepository);

      withdrawalCoreRepository.createWithdrawalReason = jest
        .fn()
        .mockImplementation(async () => {
          throw new Error('this is unknown error');
        });

      await request(test.getServer())
        .delete('/user')
        .send({
          type: 1,
        })
        .set('Authorization', `Bearer ${loginUser.accessToken}`)
        .expect(500);

      const user = await test.getPrisma().user.findUniqueOrThrow({
        where: { idx: loginUser.idx },
      });

      expect(user.deletedAt).toBeNull();
    });
  });
});
