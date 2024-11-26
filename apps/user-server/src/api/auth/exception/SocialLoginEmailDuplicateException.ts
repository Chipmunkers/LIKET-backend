import { ConflictException } from '@nestjs/common';

/**
 * 중복 에러. 생성자를 통해 중복된 email과 provider를 제공
 * 해당 값은 ExceptionFilter를 통해 응답값으로 제공
 *
 * @author jochongs
 */
export class SocialLoginEmailDuplicateException extends ConflictException {
  public email: string;
  public provider: string;

  constructor(message: string, email: string, provider: string) {
    super(message);
    this.email = email;
    this.provider = provider;
  }
}
