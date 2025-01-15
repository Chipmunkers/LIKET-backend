import { NotFoundException } from '@nestjs/common';

export class KopisPerformNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
