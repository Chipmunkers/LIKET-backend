import { Injectable } from '@nestjs/common';
import { SocialLoginUser } from '../../model/social-login-user';
import { ISocialLoginStrategy } from '../social-login-strategy.interface';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { KakaoCallbackResponseDto } from './dto/kakao-callback-response.dto';
import { SocialLoginUserService } from '../../../user/social-login-user.service';
import { SocialProvider } from '../social-provider.enum';
import { LoginJwtService } from '../../../../common/module/login-jwt/login-jwt.service';
import { HttpService } from '@nestjs/axios';
import { GetKakaoUserResponseDto } from './dto/get-kakao-user-response.dto';
import { GetKakaoTokenResponseDto } from './dto/get-kakao-token-response.dto';
import { Logger } from '../../../../common/module/logger/logger.decorator';
import { LoggerService } from '../../../../common/module/logger/logger.service';
import { Gender } from '../../../user/model/Gender';

@Injectable()
export class KakaoLoginStrategy implements ISocialLoginStrategy {
  private readonly API_KEY: string;
  private readonly REDIRECT_URL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly socialLoginUserService: SocialLoginUserService,
    private readonly loginJwtService: LoginJwtService,
    private readonly httpService: HttpService,
    @Logger(KakaoLoginStrategy.name) private readonly logger: LoggerService,
  ) {
    this.API_KEY = this.configService.get('kakaoLogin').apiKey;
    this.REDIRECT_URL = this.configService.get('kakaoLogin').redirectUrl;
  }

  public async login(socialLoginUser: SocialLoginUser) {
    const user = await this.socialLoginUserService.getUserBySocialId(
      socialLoginUser,
      SocialProvider.KAKAO,
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

  public async getSocialLoginUser(req: Request) {
    const callbackResponseDto = KakaoCallbackResponseDto.createDto(req);

    const accessToken = await this.getAccessTokenFromCode(
      callbackResponseDto.code,
    );

    return await this.getUserInfoFromAccessToken(accessToken);
  }

  public getRedirectURL() {
    // prettier-ignore
    return (
      'https://kauth.kakao.com/oauth/authorize?' +
      'client_id=' + this.API_KEY + '&' +
      'response_type=' + 'code' + '&' +
      'redirect_uri=' + this.REDIRECT_URL
    );
  }

  public getSignUpRedirectUrl() {
    return '/signup/social';
  }

  public async getSocialLoginUserForApp(
    req: Request,
  ): Promise<SocialLoginUser> {
    const accessToken: string = req.body.accessToken || '';

    return await this.getUserInfoFromAccessToken(accessToken);
  }

  private async getUserInfoFromAccessToken(
    accessToken: string,
  ): Promise<SocialLoginUser> {
    try {
      this.logger.log(
        this.getUserInfoFromAccessToken,
        'Fetch to https://kapi.kakao.com/v2/user/me',
      );
      const response =
        await this.httpService.axiosRef.get<GetKakaoUserResponseDto>(
          'https://kapi.kakao.com/v2/user/me?client_id=' + this.API_KEY,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          },
        );

      return new SocialLoginUser({
        id: response.data.id.toString(),
        provider: SocialProvider.KAKAO,
        nickname: response.data.kakao_account.profile.nickname,
        email: response.data.kakao_account.email,
        gender: this.getGenderFromString(response.data.kakao_account.gender),
      });
    } catch (err) {
      this.logger.error(this.getUserInfoFromAccessToken, 'Error occurred', err);
      throw err;
    }
  }

  private getGenderFromString(gender?: string): Gender | undefined {
    if (!gender) return;

    return gender === 'male' ? Gender.MALE : Gender.FEMALE;
  }

  private async getAccessTokenFromCode(code: string): Promise<string> {
    try {
      this.logger.log(
        this.getAccessTokenFromCode,
        'Fetch to https://kauth.kakao.com/oauth/token',
      );
      const response =
        await this.httpService.axiosRef.post<GetKakaoTokenResponseDto>(
          'https://kauth.kakao.com/oauth/token',
          new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: this.API_KEY,
            redirect_uri: this.REDIRECT_URL,
            code: code,
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );

      return response.data.access_token;
    } catch (err) {
      this.logger.error(this.getAccessTokenFromCode, 'Error occurred', err);
      throw err;
    }
  }
}
