import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyNotLikeReviewExcpetion extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
