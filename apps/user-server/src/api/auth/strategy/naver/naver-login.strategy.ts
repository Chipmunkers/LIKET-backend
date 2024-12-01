import { Injectable } from '@nestjs/common';
import { ISocialLoginStrategy } from '../social-login-strategy.interface';
import { Request } from 'express';
import { LoginToken } from '../../model/login-token';
import { SocialLoginUser } from '../../model/social-login-user';
import { ConfigService } from '@nestjs/config';
import { SocialLoginUserService } from '../../../user/social-login-user.service';
import { LoginJwtService } from '../../../../common/module/login-jwt/login-jwt.service';
import { HttpService } from '@nestjs/axios';
import { Logger } from '../../../../common/module/logger/logger.decorator';
import { LoggerService } from '../../../../common/module/logger/logger.service';
import { UtilService } from '../../../../common/module/util/util.service';
import { NaverCallbackResponseDto } from './dto/naver-callback-response.dto';
import { GetKakaoTokenResponseDto } from './dto/get-naver-token-response.dto';
import { GetNaverUserResponseDto } from './dto/get-naver-user-response.dto';
import { Gender } from '../../../user/model/Gender';
import { SocialProvider } from '../social-provider.enum';

@Injectable()
export class NaverLoginStrategy implements ISocialLoginStrategy {
  private readonly CLIENT_ID: string;
  private readonly REDIRECT_URL: string;
  private readonly CLIENT_SECRET: string;

  constructor(
    private readonly utilService: UtilService,
    private readonly configService: ConfigService,
    private readonly socialLoginUserService: SocialLoginUserService,
    private readonly loginJwtService: LoginJwtService,
    private readonly httpService: HttpService,
    @Logger(NaverLoginStrategy.name) private readonly logger: LoggerService,
  ) {
    this.CLIENT_ID = configService.get('naverLogin').clientId;
    this.REDIRECT_URL = configService.get('naverLogin').redirectUrl;
    this.CLIENT_SECRET = configService.get('naverLogin').clientSecret;
  }

  /**
   * @author jochongs
   */
  public async login(socialLoginUser: SocialLoginUser): Promise<LoginToken> {
    const user = await this.socialLoginUserService.getUserBySocialId(
      socialLoginUser,
      SocialProvider.NAVER,
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
  public async getSocialLoginUser(req: Request): Promise<SocialLoginUser> {
    const callbackResponseDto = NaverCallbackResponseDto.createDto(req);

    const accessToken = await this.getAccessTokenFromCode(
      callbackResponseDto.code,
    );

    return await this.getUserInfoFromAccessToken(accessToken);
  }

  /**
   * @author jochongs
   */
  public getRedirectURL() {
    const state = this.utilService.getUUID();

    // prettier-ignore
    return (
      'https://nid.naver.com/oauth2.0/authorize?' +
      'client_id=' + this.CLIENT_ID + '&' +
      'response_type=' + 'code' + '&' +
      'redirect_uri=' + encodeURIComponent(this.REDIRECT_URL) + '&' +
      'state=' + encodeURIComponent(state)
    );
  }

  /**
   * @author jochongs
   */
  public getSignUpRedirectUrl(): string {
    return '/signup/social';
  }

  /**
   * @author jochongs
   */
  public async getSocialLoginUserForApp(
    req: Request,
  ): Promise<SocialLoginUser> {
    throw new Error('아직 구현되지 않았습니다.');
  }

  /**
   * @author jochongs
   */
  private async getAccessTokenFromCode(code: string): Promise<string> {
    try {
      this.logger.log(
        this.getAccessTokenFromCode,
        'Fetch to https://nid.naver.com/oauth2.0/token',
      );

      const state = this.utilService.getUUID();

      // prettier-ignore
      const requestURL =
        'https://nid.naver.com/oauth2.0/token?' +
        'grant_type=' + 'authorization_code' + '&' +
        'client_id=' + this.CLIENT_ID + '&' +
        'client_secret=' + this.CLIENT_SECRET + '&' +
        'code=' + encodeURIComponent(code) + '&' +
        'state=' + encodeURIComponent(state)

      const response =
        await this.httpService.axiosRef.get<GetKakaoTokenResponseDto>(
          requestURL,
        );

      return response.data.access_token;
    } catch (err) {
      this.logger.error(
        this.getAccessTokenFromCode,
        'Error occurred during naver social login',
        err,
      );
      throw err;
    }
  }

  /**
   * @author jochongs
   */
  private async getUserInfoFromAccessToken(
    accessToken: string,
  ): Promise<SocialLoginUser> {
    const requestURL = 'https://openapi.naver.com/v1/nid/me';

    const response =
      await this.httpService.axiosRef.get<GetNaverUserResponseDto>(requestURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

    const userInfo = response.data.response;

    return new SocialLoginUser({
      id: userInfo.id,
      email: userInfo.email,
      nickname: userInfo.nickname,
      gender: this.getGender(userInfo.gender),
      birth: userInfo.birthyead,
      provider: SocialProvider.NAVER,
    });
  }

  /**
   * @author jochongs
   */
  private getGender(gender: 'F' | 'M' | 'U') {
    return gender === 'U'
      ? undefined
      : gender === 'M'
      ? Gender.MALE
      : Gender.FEMALE;
  }
}
