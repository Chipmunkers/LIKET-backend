import { NotFoundException } from '@nestjs/common';

export class WrongEmailCertCodeException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
