import { NotFoundException } from '@nestjs/common';

export class LiketNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
