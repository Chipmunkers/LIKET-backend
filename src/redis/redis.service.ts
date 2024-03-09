import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly redis: Cache) {}

  /**
   * 이메일 인증 번호 저장하기
   */
  setEmailVerificationCode: (
    email: string,
    randomCode: string,
  ) => Promise<void> = async (email, randomCode) => {
    await this.redis.set(`email-auth-code-${email}`, randomCode, 3000);
    return;
  };

  /**
   * 이메일 인증번호 삭제하기
   */
  delEmailVerificationCode: (email: string) => Promise<void> = async (
    email,
  ) => {
    await this.redis.del(`email-auth-code-${email}`);
    return;
  };

  /**
   * 이메일 인증번호 가져오기
   */
  getEmailVerificationCode: (email: string) => Promise<string | null> = async (
    email,
  ) => {
    const randomCode = await this.redis.get(`email-auth-code-${email}`);

    if (typeof randomCode === 'string') {
      return randomCode;
    }

    return null;
  };
}
