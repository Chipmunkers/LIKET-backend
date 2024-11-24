import { ConflictException } from '@nestjs/common';

export class AlreadyNotBlockUserException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
