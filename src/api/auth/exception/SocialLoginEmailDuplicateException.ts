import { ConflictException } from '@nestjs/common';

export class SocialLoginEmailDuplicateException extends ConflictException {
  public email: string;
  public provider: string;

  constructor(message: string, email: string, provider: string) {
    super(message);
    this.email = email;
    this.provider = provider;
  }
}
