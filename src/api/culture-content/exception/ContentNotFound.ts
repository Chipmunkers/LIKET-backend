import { NotFoundException } from '@nestjs/common';

export class ContentNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message);
  }
}
