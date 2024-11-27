import { UnauthorizedException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class InvalidEmailJwtException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
