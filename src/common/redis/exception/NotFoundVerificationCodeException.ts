import { ForbiddenException } from '@nestjs/common';

export class NotFoundVerificationCodeException extends ForbiddenException {
  constructor(message: string) {
    super(message);
  }
}
