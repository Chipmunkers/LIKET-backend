import { UnauthorizedException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class InvalidEmailOrPwException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
