import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SendEmailVerificationCodeDto } from './dto/SendEmailVerificationCodeDto';
import { CheckEmailVerificationCodeDto } from './dto/CheckEmailVerificationCodeDto';
import { HashService } from '../../common/service/hash.service';
import { LoginDto } from './dto/LoginDto';
import { RedisService } from '../../common/redis/redis.service';
import { BlockedUserException } from './exception/BlockedUserException';
import { InvalidEmailOrPwException } from './exception/InvalidEmailOrPwException';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  /**
   * 로그인하기
   */
  public login: (loginDto: LoginDto) => Promise<string> = async (loginDto) => {
    const user = await this.prisma.user.findFirst({
      select: {
        idx: true,
        pw: true,
        isAdmin: true,
        blockedAt: true,
      },
      where: {
        email: loginDto.email,
        provider: 'local',
        deletedAt: null,
      },
    });

    if (!user) {
      throw new InvalidEmailOrPwException('invalid email or password');
    }

    if (user.blockedAt) {
      throw new BlockedUserException('your account has been suspended');
    }

    if (this.hashService.comparePw(loginDto.pw, user.pw)) {
      throw new InvalidEmailOrPwException('invalid email or password');
    }

    const loginAccessToken = await this.jwtService.sign({
      idx: user.idx,
      isAdmin: user.isAdmin,
    });

    return loginAccessToken;
  };

  /**
   * 이메일 인증번호 발송하기
   */
  public sendEmailVerificationCode: (
    sendDto: SendEmailVerificationCodeDto,
  ) => Promise<void>;

  /**
   * 이메일 인증번호 확인하기
   */
  public checkEmailVerificatioCode: (
    checkDto: CheckEmailVerificationCodeDto,
  ) => Promise<boolean>;

  /**
   * 이메일 인증 토큰 검사하기
   */
  public verifyEmailAuthToken: (emailToken: string) => boolean;

  /**
   * 이메일 인증 토큰 생성하기
   */
  public signEmailAuthToken: (email: string) => string;
}
