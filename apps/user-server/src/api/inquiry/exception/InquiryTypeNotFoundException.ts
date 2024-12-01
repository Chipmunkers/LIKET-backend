import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class InquiryTypeNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
