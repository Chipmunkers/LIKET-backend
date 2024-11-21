import { ForbiddenException } from '@nestjs/common';

export class InvalidSocialLoginJwtException extends ForbiddenException {
  constructor(message: string) {
    super(message);
  }
}
