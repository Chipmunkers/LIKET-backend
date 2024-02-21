import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/api/user/user.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { AuthService } from '../../../src/api/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { InvalidEmailAuthTokenException } from '../../../src/api/user/exception/InvalidEmailAuthTokenException';
import { DuplicateUserException } from '../../../src/api/user/exception/DuplicateUserException';

describe('UserService', () => {
  let service: UserService;
  let prismaMock: PrismaService;
  let authServiceMock: AuthService;
  let jwtServiceMock: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaMock = module.get<PrismaService>(PrismaService);
    authServiceMock = module.get<AuthService>(AuthService);
    jwtServiceMock = module.get<JwtService>(JwtService);
  });

  it('Sign Up success', async () => {
    // 1. verify email auth token
    authServiceMock.verifyEmailAuthToken = jest.fn().mockReturnValue(true);

    // 2. check duplicated user with email and nickname
    prismaMock.user.findFirst = jest.fn().mockResolvedValue(null);

    // 3. create local login access token
    const outputToken = 'this.is.token';
    jwtServiceMock.sign = jest.fn().mockReturnValue(outputToken);

    await expect(
      service.signUp({
        emailToken: 'jwt token',
        pw: 'abc123',
        nickname: 'test',
      }),
    ).resolves.toBe(outputToken);
  });

  it('Sign Up fail - invalid email auth token', async () => {
    // fail to verify email auth token
    authServiceMock.verifyEmailAuthToken = jest.fn().mockReturnValue(false);

    await expect(
      service.signUp({
        emailToken: 'jwt token',
        pw: 'abc123',
        nickname: 'test',
      }),
    ).rejects.toThrow(InvalidEmailAuthTokenException);
  });

  it('Sign Up fail - duplicate user nickname', async () => {
    authServiceMock.verifyEmailAuthToken = jest.fn().mockReturnValue(true);

    // find duplicated nickname
    const inputNickname = 'duplicateNick';
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
      nickname: inputNickname,
      email: '123@xx.xx',
    });

    await expect(
      service.signUp({
        emailToken: 'jwt token',
        pw: 'abc123',
        nickname: inputNickname,
      }),
    ).rejects.toThrow(DuplicateUserException<'nickname'>);
  });

  it('Sign Up fail - duplicate user email', async () => {
    authServiceMock.verifyEmailAuthToken = jest.fn().mockReturnValue(true);

    // find duplicated email
    const inputEmail = 'abc123@xx.xx';
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
      nickname: 'test',
      email: inputEmail,
    });

    await expect(
      service.signUp({
        emailToken: 'jwt token',
        pw: 'abc123',
        nickname: 'myNickname',
      }),
    ).rejects.toThrow(DuplicateUserException<'email'>);
  });
});
