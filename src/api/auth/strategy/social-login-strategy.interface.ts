import { Request } from 'express';
import { SocialLoginUser } from '../model/social-login-user';

export interface ISocialLoginStrategy {
  /**
   * 소셜 사용자 정보 가져오기
   */
  getSocialLoginUser: (req: Request) => Promise<SocialLoginUser>;

  /**
   * 로그인
   */
  login: (socialLoginUser: SocialLoginUser) => Promise<string>;

  /**
   * 리다이렉트 경로 가져오기
   */
  getRedirectURL: () => string;

  /**
   * 회원가입 경로 가져오기
   */
  getSignUpRedirectUrl: () => string;
}
