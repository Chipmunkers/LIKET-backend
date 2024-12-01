import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class ContentNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message);
  }
}
