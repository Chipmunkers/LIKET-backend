import { NotFoundException } from '@nestjs/common';

export class InquiryNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
