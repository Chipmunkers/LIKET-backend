import { ConflictException } from '@nestjs/common';

export class EmailDuplicateException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
