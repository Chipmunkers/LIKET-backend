import { Request } from 'express';
import { SocialLoginUser } from '../model/social-login-user';
import { LoginToken } from '../model/login-token';

export interface ISocialLoginStrategy {
  /**
   * 소셜 사용자 정보 가져오기. 인가코드로 액세스 토큰을 발급 받은 후 소셜 프로필 정보를 가져옴
   * 웹 전용으로 사용하기를 권장
   */
  getSocialLoginUser: (req: Request) => Promise<SocialLoginUser>;

  /**
   * 로그인
   */
  login: (socialLoginUser: SocialLoginUser) => Promise<LoginToken>;

  /**
   * 리다이렉트 경로 가져오기
   */
  getRedirectURL: () => string;

  /**
   * 회원가입 경로 가져오기
   */
  getSignUpRedirectUrl: () => string;

  /**
   * 소셜 사용자 정보 가져오기. 액세스 토큰 또는 앱에서만 발급 받는 데이터를 통해 프로필 정보를 가져옴
   * 앱 전용으로 사용하기를 권장
   */
  getSocialLoginUserForApp: (req: Request) => Promise<SocialLoginUser>;
}
