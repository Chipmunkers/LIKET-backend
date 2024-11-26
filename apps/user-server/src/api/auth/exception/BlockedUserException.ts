import { HttpException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class BlockedUserException extends HttpException {
  constructor(message: string) {
    super(message, 418);
  }
}
