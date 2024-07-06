import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { HashService } from '../../common/module/hash/hash.service';
import { LoginDto } from './dto/local-login.dto';
import { BlockedUserException } from './exception/BlockedUserException';
import { InvalidEmailOrPwException } from './exception/InvalidEmailOrPwException';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { LoginJwtService } from '../../common/module/login-jwt/login-jwt.service';
import { SocialProvider } from './strategy/social-provider.enum';
import { ISocialLoginStrategy } from './strategy/social-login-strategy.interface';
import { KakaoLoginStrategy } from './strategy/kakao/kakao-login.strategy';
import { Request, Response } from 'express';
import { SocialLoginUser } from './model/social-login-user';
import { SocialLoginJwtService } from '../../common/module/social-login-jwt/social-login-jwt.service';

@Injectable()
export class AuthService {
  private readonly socialLoginStrategyMap: Record<
    SocialProvider,
    ISocialLoginStrategy
  >;

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly loginJwtService: LoginJwtService,
    private readonly socialLoginJwtService: SocialLoginJwtService,
    @Logger('AuthService') private readonly logger: LoggerService,
    private readonly kakaoLoginStrategy: KakaoLoginStrategy,
  ) {
    this.socialLoginStrategyMap = {
      [SocialProvider.KAKAO]: kakaoLoginStrategy,
    };
  }

  /**
   * 로컬 로그인
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

    const loginAccessToken = this.loginJwtService.sign(user.idx, user.isAdmin);

    return loginAccessToken;
  };

  /**
   * 소셜 로그인
   */
  public async socialLogin(
    req: Request,
    res: Response,
    provider: SocialProvider,
  ) {
    const strategy = this.socialLoginStrategyMap[provider];

    try {
      const socialLoginUser = await strategy.getSocialLoginUser(req);

      const isFirstLogin = await this.checkFirstSocialLogin(socialLoginUser);
      if (isFirstLogin) {
        const socialLoginToken = await this.socialLoginJwtService.sign(
          socialLoginUser,
        );

        const successUrl = strategy.getSignUpRedirectUrl();
        res.redirect(`${successUrl}?token=${socialLoginToken}`);
        return;
      }

      const isDuplicateSocialUser = await this.checkDuplicateSocialEmail(
        socialLoginUser,
      );
      if (isDuplicateSocialUser) {
        // TODO: change redirect URL
        res.redirect('/error');
        return;
      }

      await strategy.login(socialLoginUser);
      res.redirect('/');
    } catch (err) {
      res.redirect('/error');
    }
  }

  /**
   * URL 가져오기
   */
  public getSocialLoginUrl(provider: SocialProvider) {
    const strategy = this.socialLoginStrategyMap[provider];

    return strategy.getRedirectURL();
  }

  private async checkFirstSocialLogin(
    socialLoginUser: SocialLoginUser,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        snsId: socialLoginUser.id,
        provider: socialLoginUser.provider,
        deletedAt: null,
      },
    });

    if (user) {
      return false;
    }

    return true;
  }

  private async checkDuplicateSocialEmail(
    socialLoginUser: SocialLoginUser,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: socialLoginUser.email,
        deletedAt: null,
      },
    });

    if (user) {
      return true;
    }

    return false;
  }
}
