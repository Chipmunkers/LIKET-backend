import { ConflictException } from '@nestjs/common';

export class AlreadyBlockUserException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
