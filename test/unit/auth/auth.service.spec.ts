import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { AuthService } from '../../../src/api/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../../../src/common/service/hash.service';
import { InvalidEmailOrPwException } from '../../../src/api/auth/exception/InvalidEmailOrPwException';

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: PrismaService;
  let jwtServiceMock: JwtService;
  let hashServiceMock: HashService;

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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaMock = module.get<PrismaService>(PrismaService);
    jwtServiceMock = module.get<JwtService>(JwtService);
    hashServiceMock = module.get<HashService>(HashService);
  });

  it('login success', async () => {
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
      pw: 'hashedPw',
      provider: 'local',
    });
    hashServiceMock.comparePw = jest.fn().mockReturnValue(true);
    jwtServiceMock.sign = jest.fn().mockReturnValue('this.is.jwt');

    await expect(
      service.login({
        email: 'abc123@xx.xx',
        pw: 'password',
      }),
    ).resolves.toBe('this.is.jwt');
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
});
