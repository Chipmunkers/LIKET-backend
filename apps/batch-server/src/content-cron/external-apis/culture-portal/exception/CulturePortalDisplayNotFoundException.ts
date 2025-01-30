import { NotFoundException } from '@nestjs/common';

export class CulturePortalDisplayNotFoundException extends NotFoundException {
  constructor(message: string, seq: string) {
    super(message);
  }
}
