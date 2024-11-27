import { ForbiddenException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class NotFoundVerificationCodeException extends ForbiddenException {
  constructor(message: string) {
    super(message);
  }
}
