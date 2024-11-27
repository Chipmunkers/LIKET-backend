import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class BannerOrderOutOfRangeException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
