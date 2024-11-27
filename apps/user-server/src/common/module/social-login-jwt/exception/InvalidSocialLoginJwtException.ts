import { ForbiddenException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class InvalidSocialLoginJwtException extends ForbiddenException {
  constructor(message: string) {
    super(message);
  }
}
