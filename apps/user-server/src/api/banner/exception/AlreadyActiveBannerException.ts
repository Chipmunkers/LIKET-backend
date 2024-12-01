import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyActiveBannerException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
