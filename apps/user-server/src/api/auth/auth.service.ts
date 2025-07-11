import { Injectable } from '@nestjs/common';
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
import { LoginToken } from './model/login-token';
import { NaverLoginStrategy } from './strategy/naver/naver-login.strategy';
import { InvalidRefreshTokenType } from '../../common/module/login-jwt/exception/InvalidRefreshTokenType';
import { InvalidRefreshTokenException } from '../../common/module/login-jwt/exception/InvalidRefreshTokenException';
import { SocialLoginUserService } from '../user/social-login-user.service';
import { SocialLoginEmailDuplicateException } from './exception/SocialLoginEmailDuplicateException';
import { LoginJwtPayload } from '../../common/module/login-jwt/model/login-jwt-payload';
import { AppleLoginStrategy } from './strategy/apple/apple-login.strategy';
import { UserCoreService } from 'libs/core/user/user-core.service';
import { HashService } from 'libs/modules/hash/hash.service';
import { UserModel } from 'libs/core/user/model/user.model';

@Injectable()
export class AuthService {
  private readonly socialLoginStrategyMap: Record<
    SocialProvider,
    ISocialLoginStrategy
  >;

  constructor(
    private readonly hashService: HashService,
    private readonly loginJwtService: LoginJwtService,
    private readonly socialLoginUserService: SocialLoginUserService,
    @Logger('AuthService') private readonly logger: LoggerService,
    private readonly kakaoLoginStrategy: KakaoLoginStrategy,
    private readonly naverLoginStrategy: NaverLoginStrategy,
    private readonly appleLoginStrategy: AppleLoginStrategy,
    private readonly userCoreService: UserCoreService,
  ) {
    this.socialLoginStrategyMap = {
      [SocialProvider.KAKAO]: this.kakaoLoginStrategy,
      [SocialProvider.NAVER]: this.naverLoginStrategy,
      [SocialProvider.APPLE]: this.appleLoginStrategy,
    };
  }

  /**
   * 로컬 로그인
   *
   * @author jochongs
   */
  public async login(loginDto: LoginDto): Promise<LoginToken> {
    const user = await this.userCoreService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new InvalidEmailOrPwException('invalid email or password');
    }

    if (user.provider !== 'local') {
      throw new InvalidEmailOrPwException('invalid email');
    }

    if (user.blockedAt) {
      throw new BlockedUserException('your account has been suspended');
    }

    if (!(await this.hashService.comparePw(loginDto.pw, user.pw || ''))) {
      throw new InvalidEmailOrPwException('invalid email or password');
    }

    const accessToken = this.loginJwtService.sign(user.idx, user.isAdmin);
    const refreshToken = await this.loginJwtService.signRefreshToken(
      user.idx,
      user.isAdmin,
    );

    await this.updateLoginTimeByUserIdx(user.idx);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 소셜 로그인 (웹 전용)
   *
   * 인가 코드부터 받아 처리하도록 설계되어 있음.
   *
   * @author jochongs
   */
  public async socialLoginForWeb(
    req: Request,
    res: Response,
    provider: SocialProvider,
  ) {
    const strategy = this.socialLoginStrategyMap[provider];
    this.logger.log(this.socialLoginForWeb, `social login ${provider}`);

    try {
      // * 인가코드를 통해 소셜 로그인 사용자 정보를 받아옴
      const socialLoginUser = await strategy.getSocialLoginUser(req);

      const loginToken = await this.socialLogin(socialLoginUser);

      this.redirect(
        res,
        `/social-login-complete/success?refresh-token=${loginToken.refreshToken}`,
      );
    } catch (err) {
      this.logger.error(this.socialLoginForWeb, 'Social Login Error', err);

      // * 이메일 중복
      if (err instanceof SocialLoginEmailDuplicateException) {
        return this.redirect(
          res,
          `/social-login-complete/duplicated-email?provider=${err.provider}&email=${err.email}`,
        );
      }

      // * 정지된 사용자
      if (err instanceof BlockedUserException) {
        return this.redirect(res, '/social-login-complete/block-user');
      }

      // * 예상하지 못한 에러
      this.redirect(
        res,
        '/social-login-complete/error?message=unexpected-error',
      );
    }
  }

  /**
   * 소셜 로그인 (앱 전용)
   *
   * 액세스 토큰을 받아 처리하게 되어있음
   *
   * @author jochongs
   */
  public async socialLoginForApp(req: Request, provider: SocialProvider) {
    const strategy = this.socialLoginStrategyMap[provider];

    try {
      const socialLoginUser = await strategy.getSocialLoginUserForApp(req);

      return await this.socialLogin(socialLoginUser);
    } catch (err) {
      this.logger.error(this.socialLoginForApp, 'Social Login Error', err);

      throw err;
    }
  }

  /**
   * 소셜 사용자 정보를 통해 로그인 또는 회원가입
   *
   * socialLoginForWeb 또는 socialLoginForApp 메서드에서 호출하도록 해야함
   *
   * @author jochongs
   *
   * @throws {SocialLoginEmailDuplicateException} 중복으로 가입된 이메일인 경우
   * @throws {BlockedUserException} 정지된 사용자인 경우
   */
  public async socialLogin(socialUser: SocialLoginUser) {
    const strategy = this.socialLoginStrategyMap[socialUser.provider];

    try {
      let loginUser = await this.userCoreService.findUserBySnsId(
        socialUser.id,
        socialUser.provider,
      );
      if (!loginUser) {
        // * 첫 번째 회원가입
        const duplicateUser = await this.userCoreService.findUserByEmail(
          socialUser.email,
        );
        if (duplicateUser) {
          throw new SocialLoginEmailDuplicateException(
            'email duplicate',
            duplicateUser.email,
            duplicateUser.provider,
          );
        }

        loginUser =
          await this.socialLoginUserService.signUpSocialUser(socialUser);
      }

      if (loginUser.blockedAt) {
        throw new BlockedUserException('blocked user');
      }

      const loginToken = await strategy.login(socialUser);

      await this.updateLoginTimeByUserIdx(loginUser.idx);

      return loginToken;
    } catch (err) {
      this.logger.error(this.socialLogin, 'Social Login Error', err);

      throw err;
    }
  }

  /**
   * URL 가져오기
   *
   * @author jochongs
   */
  public getSocialLoginUrl(provider: SocialProvider) {
    const strategy = this.socialLoginStrategyMap[provider];

    return strategy.getRedirectURL();
  }

  /**
   * Access token 재발급하기
   *
   * @author jochongs
   */
  public async reissueAccessToken(
    res: Response,
    refreshToken?: string,
  ): Promise<string> {
    try {
      if (!refreshToken) {
        throw new InvalidRefreshTokenException(
          'no refresh token',
          InvalidRefreshTokenType.NO_TOKEN,
        );
      }

      const payload =
        await this.loginJwtService.verifyRefreshToken(refreshToken);

      const accessToken = this.loginJwtService.sign(
        payload.idx,
        payload.isAdmin,
      );

      return accessToken;
    } catch (err) {
      res.clearCookie('refreshToken');
      throw err;
    }
  }

  /**
   * 로그아웃 하기
   *
   * @author jochongs
   */
  public async logout(refreshToken?: string) {
    if (refreshToken) {
      const base64Url = refreshToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = Buffer.from(base64, 'base64').toString('utf8');
      const payload: LoginJwtPayload = JSON.parse(decodedPayload);
      await this.userCoreService.updateUserLastLoginByIdx(payload.idx, null);
    }
  }

  /**
   * @author jochongs
   */
  private redirect(res: Response, path: string) {
    res.redirect(process.env.FRONT_DOMAIN + path);
  }

  /**
   * 로그인 시간 설정하기
   *
   * @author jochongs
   *
   * @param idx 사용자 인덱스
   */
  private async updateLoginTimeByUserIdx(idx: number) {
    await this.userCoreService.updateUserLastLoginByIdx(idx);
  }

  /**
   * 사용자 정보 불러오기
   * ! 주의: AuthGuard에서만 사용 권장
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   */
  public async findUserByIdx(idx: number): Promise<UserModel | null> {
    return await this.userCoreService.findUserByIdx(idx);
  }
}
