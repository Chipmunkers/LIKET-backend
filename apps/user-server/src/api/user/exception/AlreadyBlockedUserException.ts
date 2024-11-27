import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyBlockedUserException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
