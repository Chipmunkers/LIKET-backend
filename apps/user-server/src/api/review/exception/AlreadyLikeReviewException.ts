import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyLikeReviewException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
