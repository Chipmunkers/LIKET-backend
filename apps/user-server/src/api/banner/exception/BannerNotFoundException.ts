import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class BannerNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
