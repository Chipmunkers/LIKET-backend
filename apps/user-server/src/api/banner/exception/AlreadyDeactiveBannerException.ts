import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyDeactiveBannerException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
