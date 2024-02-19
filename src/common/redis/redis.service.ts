import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly redis: Cache) {}

  /**
   * 이메일 인증 번호 저장하기
   */
  setEmailVerificationCode: (
    email: string,
    randomCode: string,
  ) => Promise<void>;

  /**
   * 이메일 인증번호 삭제하기
   */
  delEmailVerificationCode: (email: string) => Promise<void>;

  /**
   * 이메일 인증번호 가져오기
   */
  getEmailVerificationCode: (email: string) => Promise<string>;
}
