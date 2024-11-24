import { ConflictException } from '@nestjs/common';

export class AlreadyActivatedNoticeException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
