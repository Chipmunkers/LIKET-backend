import { ConflictException } from '@nestjs/common';

export class DuplicateAnswerException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
