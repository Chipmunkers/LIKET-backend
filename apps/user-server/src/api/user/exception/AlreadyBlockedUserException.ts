import { ConflictException } from '@nestjs/common';

export class AlreadyBlockedUserException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
