import { ConflictException } from '@nestjs/common';

export class SameBannerOrderException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
