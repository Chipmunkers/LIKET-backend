import { ConflictException } from '@nestjs/common';

export class AlreadyNotBlockedUserException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
