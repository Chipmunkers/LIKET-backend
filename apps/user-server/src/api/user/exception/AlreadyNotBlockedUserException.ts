import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyNotBlockedUserException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
