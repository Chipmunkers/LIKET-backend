import { ConflictException } from '@nestjs/common';

export class AlreadyDeactiveBannerException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
