import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyNotLikeReviewException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
