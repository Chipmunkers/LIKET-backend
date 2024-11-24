import { ConflictException } from '@nestjs/common';

export class AlreadyNotPinnedNoticeException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
