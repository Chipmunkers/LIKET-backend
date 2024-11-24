import { ConflictException } from '@nestjs/common';

export class AlreadyPinnedNoticeException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
