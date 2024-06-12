import { NotFoundException } from '@nestjs/common';

export class CodeNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
