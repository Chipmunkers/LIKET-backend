import { ConflictException } from '@nestjs/common';

export class NicknameDuplicateException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
