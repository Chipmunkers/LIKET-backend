import { BadRequestException } from '@nestjs/common';

export class BannerOrderOutOfRangeException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
