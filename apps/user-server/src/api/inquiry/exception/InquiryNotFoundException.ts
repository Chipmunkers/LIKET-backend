import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class InquiryNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
