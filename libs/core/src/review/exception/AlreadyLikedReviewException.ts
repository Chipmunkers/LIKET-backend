import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyLikedReviewException extends ConflictException {
  public readonly userIdx: number;
  public readonly reviewIdx: number;

  constructor(userIdx: number, reviewIdx: number) {
    super(`Already liked review`);
    this.userIdx = userIdx;
    this.reviewIdx = reviewIdx;
  }
}
