import { PickType } from '@nestjs/swagger';
import { liketReviewSelectField } from 'libs/core/liket/model/prisma/liket-review-select-field';
import { ReviewModel } from 'libs/core/review/model/review.model';

/**
 * @author jochongs
 */
export class LiketReviewModel extends PickType(ReviewModel, [
  'idx',
  'visitTime',
  'starRating',
]) {
  constructor(data: LiketReviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(review: liketReviewSelectField): LiketReviewModel {
    return new LiketReviewModel({
      idx: review.idx,
      visitTime: review.visitTime,
      starRating: review.starRating,
    });
  }
}
