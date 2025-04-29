import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyCancelToLikeReviewException extends ConflictException {
  public readonly userIdx: number;
  public readonly reviewIdx: number;

  constructor(userIdx: number, reviewIdx: number) {
    super('Already cancel to like review');
    this.userIdx = userIdx;
    this.reviewIdx = reviewIdx;
  }
}
