import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/api/user/user.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { AuthService } from '../../../src/api/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { InvalidEmailAuthTokenException } from '../../../src/api/user/exception/InvalidEmailAuthTokenException';
import { DuplicateUserException } from '../../../src/api/user/exception/DuplicateUserException';
import { HashService } from '../../../src/common/service/hash.service';
import { AlreadyBlockedUserException } from '../../../src/api/user/exception/AlreadyBlockedUserException';
import { UserNotFoundException } from '../../../src/api/user/exception/UserNotFoundException';

describe('UserService', () => {
  let service: UserService;
  let prismaMock: PrismaService;
  let authServiceMock: AuthService;
  let jwtServiceMock: JwtService;
  let hashService: HashService;

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
    hashService = module.get<HashService>(HashService);
  });

  it('signUp success', async () => {
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

  it('signUp fail - invalid email auth token', async () => {
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

  it('signUp fail - duplicate user nickname', async () => {
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

  it('signUp fail - duplicate user email', async () => {
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

  it('getUserByIdx success', async () => {
    // 1. find user
    const findUser = {
      idx: 1,
      // ...Something
    };
    prismaMock.user.findFirst = jest.fn().mockResolvedValue(findUser);

    await expect(service.getUserByIdx(1)).resolves.toStrictEqual(findUser);
  });

  it('getUserByIdx fail - cannot find user', async () => {
    // cannot find user
    prismaMock.user.findFirst = jest.fn().mockResolvedValue(null);

    await expect(service.getUserByIdx(1)).rejects.toThrow(
      UserNotFoundException,
    );
  });

  it('updatePw success', async () => {
    // 1. check email auth token
    authServiceMock.verifyEmailAuthToken = jest.fn().mockReturnValue(true);

    // 2. hash password
    hashService.hashPw = jest.fn().mockReturnValue('hashedPassword');

    // 3. update user data
    prismaMock.user.update = jest.fn().mockResolvedValue({ idx: 1 });

    await expect(
      service.updatePw(1, {
        pw: 'abc123123',
        emailToken: 'this.is.token',
      }),
    ).resolves.toBeUndefined();
  });

  it('updatePw fail - invalid check email auth token', async () => {
    // fail to verify email auth token
    authServiceMock.verifyEmailAuthToken = jest.fn().mockReturnValue(false);

    await expect(
      service.updatePw(1, {
        pw: 'abc123123',
        emailToken: 'this.is.token',
      }),
    ).rejects.toThrow(InvalidEmailAuthTokenException);
  });

  it('blockUser success', async () => {
    // 1. find user for checking already blocked user
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      blockedAt: null,
    });

    // 2. block user
    prismaMock.user.update = jest.fn().mockResolvedValue({});

    await expect(service.blockUser(1)).resolves.toBeUndefined();
  });

  it('blockUser fail - already blocked user', async () => {
    // 1. find user for checking already blocked user
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      blockedAt: new Date(),
    });

    await expect(service.blockUser(1)).rejects.toThrow(
      AlreadyBlockedUserException,
    );
  });
});
