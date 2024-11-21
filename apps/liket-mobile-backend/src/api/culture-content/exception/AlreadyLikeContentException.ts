import { ConflictException } from '@nestjs/common';

export class AlreadyLikeContentException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
