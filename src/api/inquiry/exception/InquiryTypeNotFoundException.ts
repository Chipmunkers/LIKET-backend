import { NotFoundException } from '@nestjs/common';

export class InquiryTypeNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
