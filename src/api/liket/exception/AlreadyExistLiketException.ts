import { ConflictException } from '@nestjs/common';

export class AlreadyExistLiketException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
