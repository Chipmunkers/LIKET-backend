import { UnauthorizedException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class InvalidLoginJwtException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
