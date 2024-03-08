import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AuthService } from '../../../src/api/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../../../src/hash/hash.service';
import { InvalidEmailOrPwException } from '../../../src/api/auth/exception/InvalidEmailOrPwException';
import { RedisService } from '../../../src/common/redis/redis.service';
import { MailerService } from '@nestjs-modules/mailer';
import { NotFoundVerificationCodeException } from '../../../src/common/redis/exception/NotFoundVerificationCodeException';
import { InvalidEmailVerificationCodeException } from '../../../src/api/auth/exception/InvalidEmailVerificationCodeException';
import { BlockedUserException } from '../../../src/api/auth/exception/BlockedUserException';
import { InvalidEmailAuthTokenException } from '../../../src/api/auth/exception/InvalidEmailAuthTokenException';
import { InvalidLoginAccessTokenException } from '../../../src/api/auth/exception/InvalidLoginAccessTokenException';

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: PrismaService;
  let jwtServiceMock: JwtService;
  let hashServiceMock: HashService;
  let redisMock: RedisService;
  let mailerServiceMock: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {},
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: HashService,
          useValue: {},
        },
        {
          provide: RedisService,
          useValue: {},
        },
        {
          provide: MailerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaMock = module.get<PrismaService>(PrismaService);
    jwtServiceMock = module.get<JwtService>(JwtService);
    hashServiceMock = module.get<HashService>(HashService);
    redisMock = module.get<RedisService>(RedisService);
    mailerServiceMock = module.get<MailerService>(MailerService);
  });

  it('login success', async () => {
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
      pw: 'hashedPw',
      provider: 'local',
      blockedAt: null,
    });
    hashServiceMock.comparePw = jest.fn().mockReturnValue(true);
    service.signLoginAccessToken = jest.fn().mockReturnValue('this.is.jwt');

    await expect(
      service.login({
        email: 'abc123@xx.xx',
        pw: 'password',
      }),
    ).resolves.toBe('this.is.jwt');
    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
    expect(hashServiceMock.comparePw).toHaveBeenCalledTimes(1);
    expect(service.signLoginAccessToken).toHaveBeenCalledTimes(1);
  });

  it('login fail - blocked user', async () => {
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
      pw: 'hashedPw',
      provider: 'local',
      blockedAt: new Date(),
    });

    await expect(
      service.login({
        email: 'abc123@xx.xx',
        pw: 'password',
      }),
    ).rejects.toThrow(BlockedUserException);
  });

  it('login fail - cannot find user', async () => {
    prismaMock.user.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      service.login({
        email: 'abc123@xx.xx',
        pw: 'password',
      }),
    ).rejects.toThrow(InvalidEmailOrPwException);
  });

  it('login fail - account is not local provider', async () => {
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
      pw: 'hashedPw',
      provider: 'kakao',
    });

    await expect(
      service.login({
        email: 'abc123@xx.xx',
        pw: 'password',
      }),
    ).rejects.toThrow(InvalidEmailOrPwException);
  });

  it('login fail - invalid password', async () => {
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
      pw: 'hashedPw',
      provider: 'local',
    });
    hashServiceMock.comparePw = jest.fn().mockReturnValue(false);

    await expect(
      service.login({
        email: 'abc123@xx.xx',
        pw: 'password',
      }),
    ).rejects.toThrow(InvalidEmailOrPwException);
  });

  it('sendEmailVerificationCode success', async () => {
    redisMock.setEmailVerificationCode = jest.fn().mockResolvedValue(undefined);
    mailerServiceMock.sendMail = jest.fn().mockResolvedValue({});

    await expect(
      service.sendEmailVerificationCode({
        email: 'abc123@xx.xx',
      }),
    ).resolves.toBeUndefined();
    expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
    expect(redisMock.setEmailVerificationCode).toHaveBeenCalledTimes(1);
  });

  it('checkEmailVerificationCode success', async () => {
    // 1. store random code
    const randomCode = '123123';
    redisMock.getEmailVerificationCode = jest
      .fn()
      .mockResolvedValue(randomCode);

    // 2. sign email token
    service.signEmailAuthToken = jest.fn().mockReturnValue('this.is.token');

    // 3. delete random code in redis
    redisMock.delEmailVerificationCode = jest.fn().mockResolvedValue(undefined);

    await expect(
      service.checkEmailVerificatioCode({
        email: 'abc123@xx.xx',
        code: randomCode,
      }),
    ).resolves.toBe('this.is.token');
  });

  it('checkEmailVerificationCode fail - verification code not found', async () => {
    redisMock.getEmailVerificationCode = jest.fn().mockResolvedValue(null);

    await expect(
      service.checkEmailVerificatioCode({
        email: 'abc123@xx.xx',
        code: '123123',
      }),
    ).rejects.toThrow(NotFoundVerificationCodeException);
  });

  it('checkEmailVerificationCode fail - incorrect code', async () => {
    const randomCode = '000000';
    redisMock.getEmailVerificationCode = jest
      .fn()
      .mockResolvedValue(randomCode);

    await expect(
      service.checkEmailVerificatioCode({
        email: 'abc123@xx.xx',
        code: '123123',
      }),
    ).rejects.toThrow(InvalidEmailVerificationCodeException);
  });

  it('verifyEmailAuthToken succss', async () => {
    const email = 'abc123@xx.xx';
    jwtServiceMock.verify = jest.fn().mockReturnValue({
      email,
    });
    const inputToken = 'this.is.token';

    expect(service.verifyEmailAuthToken(inputToken)).toBe(email);
  });

  it('verifyEmailAuthToken fail - token non-existence', async () => {
    const inputToken = '';

    expect(() => {
      service.verifyEmailAuthToken(inputToken);
    }).toThrow(InvalidEmailAuthTokenException);
  });

  it('verifyEmailAuthToken fail - invalid token', async () => {
    jwtServiceMock.verify = jest.fn().mockImplementation(() => {
      throw new Error('invalid token error'); // any error
    });

    const invalidToken = 'this.is.invalidtoken';

    expect(() => {
      service.verifyEmailAuthToken(invalidToken);
    }).toThrow(InvalidEmailAuthTokenException);
  });

  it('verifyEmailAuthToken fail - not email auth token', async () => {
    jwtServiceMock.verify = jest.fn().mockResolvedValue({
      idx: 1,
    });

    expect(() => {
      service.verifyEmailAuthToken('this.is.login-token');
    }).toThrow(InvalidEmailAuthTokenException);
  });

  it('signEmailAuthToken', async () => {
    const token = 'this.is.token';
    jwtServiceMock.sign = jest.fn().mockReturnValue(token);

    expect(service.signEmailAuthToken('abc123@xx.xx')).toBe(token);
  });

  it('verifyLoginAccessToken success', () => {
    // 1. verify token
    jwtServiceMock.verify = jest.fn().mockReturnValue({
      idx: 1,
      isAdmin: false,
    });

    expect(service.verifyLoginAccessToken('this.is.token')).toStrictEqual({
      idx: 1,
      isAdmin: false,
    });
  });

  it('verifyLoginAccessToken fail - fail to verify', () => {
    // fail to verify
    jwtServiceMock.verify = jest.fn().mockImplementation(() => {
      throw new Error('fail to verify');
    });

    expect(() => {
      service.verifyLoginAccessToken('this.is.token');
    }).toThrow(InvalidLoginAccessTokenException);
  });

  it('verifyLoginAccessToken fail - payload does not have idx field', () => {
    // payload does not have idx
    jwtServiceMock.verify = jest.fn().mockReturnValue({
      isAdmin: true,
    });

    expect(() => {
      service.verifyLoginAccessToken('this.is.token');
    }).toThrow(InvalidLoginAccessTokenException);
  });

  it('verifyLoginAccessToken fail - payload does not have isAdmin field', () => {
    // payload does not have isAdmin
    jwtServiceMock.verify = jest.fn().mockReturnValue({
      idx: 1,
    });

    expect(() => {
      service.verifyLoginAccessToken('this.is.token');
    }).toThrow(InvalidLoginAccessTokenException);
  });
});
