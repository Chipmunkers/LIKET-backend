import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyNotLikeContentException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
