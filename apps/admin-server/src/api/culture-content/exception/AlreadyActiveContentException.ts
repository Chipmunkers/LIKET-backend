import { ConflictException } from '@nestjs/common';

export class AlreadyActiveContentException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
