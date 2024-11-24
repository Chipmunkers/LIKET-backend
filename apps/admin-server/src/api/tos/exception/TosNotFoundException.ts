import { NotFoundException } from '@nestjs/common';

export class TosNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
