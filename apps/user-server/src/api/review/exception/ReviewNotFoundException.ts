import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class ReviewNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
