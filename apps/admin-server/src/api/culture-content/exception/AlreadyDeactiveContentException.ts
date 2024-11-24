import { ConflictException } from '@nestjs/common';

export class AlreadyDeactiveContentException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
