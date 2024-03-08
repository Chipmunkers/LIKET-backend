import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendEmailVerificationCodeDto } from './dto/SendEmailVerificationCodeDto';
import { CheckEmailVerificationCodeDto } from './dto/CheckEmailVerificationCodeDto';
import { HashService } from '../../hash/hash.service';
import { LoginDto } from './dto/LoginDto';
import { RedisService } from '../../common/redis/redis.service';
import { BlockedUserException } from './exception/BlockedUserException';
import { InvalidEmailOrPwException } from './exception/InvalidEmailOrPwException';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { NotFoundVerificationCodeException } from '../../common/redis/exception/NotFoundVerificationCodeException';
import { InvalidEmailVerificationCodeException } from './exception/InvalidEmailVerificationCodeException';
import { InvalidEmailAuthTokenException } from './exception/InvalidEmailAuthTokenException';
import { InvalidLoginAccessTokenException } from './exception/InvalidLoginAccessTokenException';
import { Logger } from '../../logger/logger.decorator';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly mailerService: MailerService,
    @Logger('AuthService') private readonly logger: LoggerService,
  ) {}

  /**
   * 로그인하기
   */
  public login: (loginDto: LoginDto) => Promise<string> = async (loginDto) => {
    this.logger.log('login', 'find user');
    const user = await this.prisma.user.findFirst({
      select: {
        idx: true,
        pw: true,
        isAdmin: true,
        blockedAt: true,
        provider: true,
      },
      where: {
        email: loginDto.email,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new InvalidEmailOrPwException('invalid email or password');
    }

    if (user.provider !== 'local') {
      throw new InvalidEmailOrPwException('invalid email or password');
    }

    if (user.blockedAt) {
      throw new BlockedUserException('your account has been suspended');
    }

    if (!this.hashService.comparePw(loginDto.pw, user.pw || '')) {
      throw new InvalidEmailOrPwException('invalid email or password');
    }

    const loginAccessToken = this.signLoginAccessToken(user.idx, user.isAdmin);

    return loginAccessToken;
  };

  /**
   * 이메일 인증번호 발송하기
   */
  public sendEmailVerificationCode: (
    sendDto: SendEmailVerificationCodeDto,
  ) => Promise<void> = async (sendDto) => {
    // generate randon code
    this.logger.log('sendEmailVerificationCode', 'create random code');
    const randomCode = Math.floor(Math.random() * 10 ** 6)
      .toString()
      .padStart(6, '0');

    await this.redis.setEmailVerificationCode(sendDto.email, randomCode);

    this.logger.log(
      'sendEmailVerificationCode',
      'send a verification code to the email',
    );
    await this.mailerService.sendMail({
      to: sendDto.email,
      subject: 'Liket 인증번호',
      html: `<h1>${randomCode}</h1>`,
    });

    return;
  };

  /**
   * 이메일 인증번호 확인하기
   */
  public checkEmailVerificatioCode: (
    checkDto: CheckEmailVerificationCodeDto,
  ) => Promise<string> = async (checkDto) => {
    const randomCode = await this.redis.getEmailVerificationCode(
      checkDto.email,
    );

    if (!randomCode) {
      throw new NotFoundVerificationCodeException('not send verification code');
    }

    if (checkDto.code !== randomCode) {
      throw new InvalidEmailVerificationCodeException(
        'wrong verification code',
      );
    }

    this.logger.log(
      'checkEmailVerificationCode',
      'delete email verification code',
    );
    await this.redis.delEmailVerificationCode(checkDto.email);

    this.logger.log('checkEmailVerificationCode', 'create email auth token');
    const token = this.signEmailAuthToken(checkDto.email);

    return token;
  };

  /**
   * 이메일 인증 토큰 검사하기
   */
  public verifyEmailAuthToken: (emailToken: string) => string = (
    emailToken,
  ) => {
    if (!emailToken) {
      throw new InvalidEmailAuthTokenException('There is not a token');
    }

    let payload: any;
    try {
      this.logger.log('verifyEmailAuthToken', 'try to verify email auth token');
      payload = this.jwtService.verify(emailToken);
    } catch (err) {
      throw new InvalidEmailAuthTokenException(
        'Cannot verify email auth token',
      );
    }

    if (!payload.email || typeof payload.email !== 'string') {
      throw new InvalidEmailAuthTokenException(
        'This is not a email auth token',
      );
    }

    return payload.email;
  };

  /**
   * 이메일 인증 토큰 생성하기
   */
  public signEmailAuthToken: (email: string) => string = (email) => {
    this.logger.log('signEmailAuthToken', 'sign email auth token');
    const token = this.jwtService.sign(
      {
        email: email,
      },
      {
        expiresIn: '6h',
      },
    );

    return token;
  };

  /**
   * 로그인 액세스 토큰 생성하기
   */
  public signLoginAccessToken: (idx: number, isAdmin: boolean) => string = (
    idx,
    isAdmin,
  ) => {
    this.logger.log('signLoginAccessToken', 'create login access token');
    return this.jwtService.sign(
      {
        idx: idx,
        isAdmin: isAdmin,
      },
      {
        expiresIn: '14d',
      },
    );
  };

  /**
   * 로그인 액세스 토큰 검증하기
   */
  public verifyLoginAccessToken: (token: string) => {
    idx: number;
    isAdmin: boolean;
  } = (token) => {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      throw new InvalidLoginAccessTokenException(
        'Cannot verify login access token',
      );
    }

    if (!payload.idx || typeof payload.idx !== 'number') {
      throw new InvalidLoginAccessTokenException(
        'Cannot verify login access token',
      );
    }

    if (typeof payload.isAdmin !== 'boolean') {
      throw new InvalidLoginAccessTokenException(
        'Cannot verify login access token',
      );
    }

    return payload;
  };
}
