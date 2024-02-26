import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/api/user/user.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { AuthService } from '../../../src/api/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { InvalidEmailAuthTokenException } from '../../../src/api/auth/exception/InvalidEmailAuthTokenException';
import { DuplicateUserException } from '../../../src/api/user/exception/DuplicateUserException';
import { HashService } from '../../../src/common/service/hash.service';
import { AlreadyBlockedUserException } from '../../../src/api/user/exception/AlreadyBlockedUserException';
import { UserNotFoundException } from '../../../src/api/user/exception/UserNotFoundException';
import { UpdateProfileDto } from '../../../src/api/user/dto/UpdateProfileDto';
import { UserEntity } from '../../../src/api/user/entity/UserEntity';

describe('UserService', () => {
  let service: UserService;
  let prismaMock: PrismaService;
  let authServiceMock: AuthService;
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
          provide: AuthService,
          useValue: {},
        },
        {
          provide: HashService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaMock = module.get<PrismaService>(PrismaService);
    authServiceMock = module.get<AuthService>(AuthService);
    hashService = module.get<HashService>(HashService);
  });

  it('signUp success', async () => {
    // 1. verify email auth token
    const email = 'abc123@xx.xx';
    authServiceMock.verifyEmailAuthToken = jest.fn().mockReturnValue(email);

    // 2. check duplicated user with email and nickname
    prismaMock.user.findFirst = jest.fn().mockResolvedValue(null);

    // 3. hash password
    hashService.hashPw = jest.fn().mockReturnValue('hashedPassword');

    // 4. create user with
    prismaMock.user.create = jest.fn().mockResolvedValue({
      email: 'abc123@xx.xx',
      isAdmin: true,
    });

    // 4. create local login access token
    const loginAccessToken = 'this.is.token';
    authServiceMock.signLoginAccessToken = jest
      .fn()
      .mockReturnValue(loginAccessToken);

    await expect(
      service.signUp({
        emailToken: 'jwt token',
        pw: 'abc123',
        nickname: 'test',
      }),
    ).resolves.toBe(loginAccessToken);
    expect(authServiceMock.verifyEmailAuthToken).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
    expect(authServiceMock.signLoginAccessToken).toHaveBeenCalledTimes(1);
  });

  it('signUp fail - duplicate user nickname', async () => {
    const email = 'abc123@xx.xx';
    authServiceMock.verifyEmailAuthToken = jest.fn().mockReturnValue(email);

    // find duplicated nickname
    const inputNickname = 'duplicateNick';
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
      nickname: inputNickname,
      email: 'test123@xx.xx',
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
    const email = 'abc123@xx.xx';
    authServiceMock.verifyEmailAuthToken = jest.fn().mockReturnValue(email);

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
    prismaMock.user.findUnique = jest.fn().mockResolvedValue(findUser);

    await expect(service.getUserByIdx(1)).resolves.toBeInstanceOf(
      UserEntity<'my', 'admin'>,
    );
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
  });

  it('getUserByIdx fail - cannot find user', async () => {
    // cannot find user
    prismaMock.user.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.getUserByIdx(1)).rejects.toThrow(
      UserNotFoundException,
    );
  });

  it('updatePw success', async () => {
    // 1. find user
    service.getUserByIdx = jest.fn().mockResolvedValue({
      idx: 1,
    });

    // 2. hash password
    hashService.hashPw = jest.fn().mockReturnValue('hashedPassword');

    // 3. update user
    prismaMock.user.update = jest.fn().mockResolvedValue({ idx: 1 });

    await expect(
      service.updatePw(1, {
        pw: 'abc123123',
      }),
    ).resolves.toBeUndefined();
    expect(service.getUserByIdx).toHaveBeenCalledTimes(1);
    expect(hashService.hashPw).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
  });

  it('updateProfile success', async () => {
    // 1. check nickname duplicate
    prismaMock.user.findFirst = jest.fn().mockResolvedValue(null);

    // 2. update user profile
    prismaMock.user.update = jest.fn().mockResolvedValue({});

    await expect(
      service.updateProfile(1, {} as UpdateProfileDto),
    ).resolves.toBeUndefined();
    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
  });

  it('updateProfile fail - nickname duplicate', async () => {
    // 1. check nickname duplicate
    prismaMock.user.findFirst = jest.fn().mockResolvedValue({
      nickname: 'test',
    });

    await expect(
      service.updateProfile(1, {} as UpdateProfileDto),
    ).rejects.toThrow(DuplicateUserException<'nickname'>);
  });

  it('blockUser success', async () => {
    // 1. find user for checking already blocked user
    prismaMock.user.findUnique = jest.fn().mockResolvedValue({
      blockedAt: null,
    });

    // 2. update user to block
    prismaMock.user.update = jest.fn().mockResolvedValue({});

    await expect(service.blockUser(1)).resolves.toBeUndefined();
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
  });

  it('blockUser fail - user not found', async () => {
    // user not found
    prismaMock.user.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.blockUser(1)).rejects.toThrow(UserNotFoundException);
  });

  it('blockUser fail - already blocked user', async () => {
    // 1. find user for checking already blocked user
    prismaMock.user.findUnique = jest.fn().mockResolvedValue({
      blockedAt: new Date(),
    });

    await expect(service.blockUser(1)).rejects.toThrow(
      AlreadyBlockedUserException,
    );
  });
});
