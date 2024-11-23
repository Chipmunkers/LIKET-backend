import { ConflictException } from '@nestjs/common';

export class AlreadyActiveBannerException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
