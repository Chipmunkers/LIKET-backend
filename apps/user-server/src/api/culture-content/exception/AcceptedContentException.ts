import { ConflictException } from '@nestjs/common';

export class AcceptedContentException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
