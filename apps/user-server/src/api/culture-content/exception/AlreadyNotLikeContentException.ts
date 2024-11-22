import { ConflictException } from '@nestjs/common';

export class AlreadyNotLikeContentException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
