import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

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
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaMock = module.get<PrismaService>(PrismaService);
    authServiceMock = module.get<AuthService>(AuthService);
    jwtServiceMock = module.get<JwtService>(JwtService);
  });

  it('Sign Up success case', async () => {
    authServiceMock.verifyEmailAuthToken = jest.fn().mockReturnValue(true);
    prismaMock.user.findFirst = jest.fn().mockResolvedValue(null);
    jwtServiceMock.verify = jest.fn().mockReturnValue('this.is.token');

    const result = await service.signUp({
      emailToken: 'jwt token',
      pw: 'abc123',
      nickname: 'test',
    });

    expect(result).toBeInstanceOf(InvalidEmailAuthToken);
  });
});
