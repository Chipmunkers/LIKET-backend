import { HashService } from '../../../../src/common/module/hash/hash.service';
import { EmailJwtService } from '../../../../src/api/email-cert/email-jwt.service';
import { LoginJwtService } from '../../../../src/common/module/login-jwt/login-jwt.service';
import { SocialLoginJwtService } from '../../../../src/common/module/social-login-jwt/social-login-jwt.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../../src/api/user/user.service';
import { LoggerService } from '../../../../src/common/module/logger/logger.service';
import { SignUpDto } from '../../../../src/api/user/dto/sign-up.dto';
import { Gender } from '../../../../src/api/user/model/Gender';
import { JwtService } from '@nestjs/jwt';
import { LoggerModule } from '../../../../src/common/module/logger/logger.module';
import { LoginJwtRepository } from '../../../../src/common/module/login-jwt/login-jwt.repository';
import { EmailCertType } from '../../../../src/api/email-cert/model/email-cert-type';
import { PrismaProvider } from 'libs/modules';

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaProvider;
  let hashService: HashService;
  let emailJwtService: EmailJwtService;
  let loginJwtService: LoginJwtService;
  let socialLoginJwtService: SocialLoginJwtService;
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        UserService,
        PrismaProvider,
        HashService,
        EmailJwtService,
        LoginJwtService,
        SocialLoginJwtService,
        LoginJwtRepository,
        JwtService,
      ],
    }).compile();

    userService = module.get(UserService);
    prisma = module.get(PrismaProvider);
    hashService = module.get(HashService);
    emailJwtService = module.get(EmailJwtService);
    loginJwtService = module.get(LoginJwtService);
    socialLoginJwtService = module.get(SocialLoginJwtService);
    logger = module.get('LoggerServiceUserService');
    jest.spyOn(logger, 'log').mockReturnValue();
    jest.spyOn(logger, 'warn').mockReturnValue();
    jest.spyOn(logger, 'error').mockReturnValue();
  });

  describe('signUp', () => {
    it('Success', async () => {
      const signUpDto: SignUpDto = {
        emailToken: 'this.is.email.token',
        pw: 'pw123123**',
        nickname: 'jochong',
        gender: Gender.MALE,
        birth: 2002,
      };

      // 1. 이메일 토큰 검증
      const email = 'test123@gmail.com';
      const emailJwtServiceVerifyMock = jest
        .spyOn(emailJwtService, 'verify')
        .mockResolvedValue(email);

      // 2. 이메일, 닉네임 중복 확인
      const prismaUserFindFirstMock = jest
        .spyOn(prisma.user, 'findFirst')
        .mockResolvedValue(null);

      // 3. 비밀번호 해싱
      const hashedPw = 'skdlfjalksadfjdsaklfjadsfklj';
      const hashServiceHashPwMock = jest
        .spyOn(hashService, 'hashPw')
        .mockReturnValue(hashedPw);

      // 4. INSERT user
      const signUpUser = {
        idx: 1,
        isAdmin: false,
        email: email,
        pw: hashedPw,
        nickname: signUpDto.nickname,
        gender: signUpDto.gender,
        birth: signUpDto.birth,
        snsId: null,
        provider: 'local',
        profileImgPath: null,
        blockedAt: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const prismaUserCreateMock = jest
        .spyOn(prisma.user, 'create')
        .mockResolvedValue(signUpUser as any);

      // 5. 로그인 토큰 생성
      const accessToken = 'this.is.accessToken';
      const refreshToken = 'this.is.refreshToken';
      const loginJwtServiceSignMock = jest
        .spyOn(loginJwtService, 'sign')
        .mockReturnValue(accessToken);
      const loginJwtServiceSignRefreshTokenMock = jest
        .spyOn(loginJwtService, 'signRefreshToken')
        .mockResolvedValue(refreshToken);

      await expect(userService.signUp(signUpDto)).resolves.toStrictEqual({
        accessToken,
        refreshToken,
      });
      expect(emailJwtServiceVerifyMock).toHaveBeenCalledWith(
        signUpDto.emailToken,
        EmailCertType.SIGN_UP,
      );
      expect(prismaUserFindFirstMock).toHaveBeenCalledTimes(1);
      expect(hashServiceHashPwMock).toHaveBeenCalledWith(signUpDto.pw);
      expect(prismaUserCreateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            pw: hashedPw,
          }),
        }),
      );
      expect(loginJwtServiceSignMock).toHaveBeenCalledWith(
        signUpUser.idx,
        signUpUser.isAdmin,
      );
      expect(loginJwtServiceSignRefreshTokenMock).toHaveBeenCalledWith(
        signUpUser.idx,
        signUpUser.isAdmin,
      );
    });
  });
});
