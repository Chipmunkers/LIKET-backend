import { ConflictException } from '@nestjs/common';

export class BannerOrderOutOfRangeException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
