import { NotFoundException } from '@nestjs/common';

export class NotSupportArea extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
