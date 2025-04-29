import { ConflictException } from '@nestjs/common';

export class AlreadyDeactivatedNoticeException extends ConflictException {
  constructor(message?: string) {
    super(message);
  }
}
