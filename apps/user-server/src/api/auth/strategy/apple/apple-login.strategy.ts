import { Request } from 'express';
import { LoginToken } from '../../model/login-token';
import { SocialLoginUser } from '../../model/social-login-user';
import { ISocialLoginStrategy } from '../social-login-strategy.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SocialProvider } from '../social-provider.enum';
import { Logger } from '../../../../common/module/logger/logger.decorator';
import { LoggerService } from '../../../../common/module/logger/logger.service';
import { SocialLoginUserService } from '../../../user/social-login-user.service';
import { LoginJwtService } from '../../../../common/module/login-jwt/login-jwt.service';

@Injectable()
export class AppleLoginStrategy implements ISocialLoginStrategy {
  private readonly CLIENT_ID: string;
  private readonly REDIRECT_URL: string;
  private readonly TEAM_ID: string;
  private readonly KEY_ID: string;
  private readonly PRIVATE_KEY_STRING: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly loginJwtService: LoginJwtService,

    private readonly socialLoginUserService: SocialLoginUserService,
    @Logger(AppleLoginStrategy.name) private readonly logger: LoggerService,
  ) {
    this.CLIENT_ID = this.configService.get('appleLogin').clientId;
    this.REDIRECT_URL = this.configService.get('appleLogin').redirectUrl;
    this.TEAM_ID = this.configService.get('appleLogin').teamId;
    this.KEY_ID = this.configService.get('appleLogin').keyId;
    this.PRIVATE_KEY_STRING = this.configService
      .get('appleLogin')
      .privateKeyString.replace(/\\n/g, '\n');
  }

  /**
   * @author jochongs
   */
  async getSocialLoginUser(req: Request) {
    const authorizationCode = req.body.code;

    const clientSecretOptions: JwtSignOptions = {
      algorithm: 'ES256',
      expiresIn: '24h',
      audience: 'https://appleid.apple.com',
      issuer: this.TEAM_ID,
      subject: this.CLIENT_ID,
      keyid: this.KEY_ID,
      secret: this.PRIVATE_KEY_STRING,
    };

    // Client Secret (JWT) 생성
    const clientSecret = this.jwtService.sign({}, clientSecretOptions);

    try {
      // Apple에 Authorization Code로 Access Token 및 ID Token 요청
      const tokenResponse = await this.httpService.axiosRef.post(
        'https://appleid.apple.com/auth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: authorizationCode,
          client_id: this.CLIENT_ID,
          client_secret: clientSecret,
          redirect_uri: this.REDIRECT_URL,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // ID Token에서 사용자 정보 추출
      const idToken = tokenResponse.data.id_token;
      const decodedToken = this.jwtService.decode(idToken) as any;

      // SocialLoginUser 객체 생성 및 반환
      return new SocialLoginUser({
        id: decodedToken.sub, // Apple의 고유 사용자 ID
        provider: SocialProvider.APPLE,
        email: decodedToken.email,
        nickname: '', // Apple 로그인에서는 닉네임 정보 없음
      });
    } catch (error) {
      this.logger.error(
        this.getSocialLoginUser,
        'Error occurred during social login',
        error,
      );
      throw error;
    }
  }

  /**
   * @author jochongs
   */
  async login(socialLoginUser: SocialLoginUser) {
    const user = await this.socialLoginUserService.getUserBySocialId(
      socialLoginUser,
      SocialProvider.APPLE,
    );

    const accessToken = this.loginJwtService.sign(user.idx, false);
    const refreshToken = await this.loginJwtService.signRefreshToken(
      user.idx,
      false,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * @author jochongs
   */
  getRedirectURL(): string {
    const authorizationUrl =
      `https://appleid.apple.com/auth/authorize?` +
      `response_type=code` +
      `&client_id=${this.CLIENT_ID}` +
      `&redirect_uri=${this.REDIRECT_URL}` +
      `&scope=email` +
      `&response_mode=form_post`;

    return authorizationUrl;
  }

  /**
   * @author jochongs
   */
  getSignUpRedirectUrl() {
    return '/signup/social';
  }

  /**
   * @author jochongs
   */
  getSocialLoginUserForApp: (req: Request) => Promise<SocialLoginUser>;
}
