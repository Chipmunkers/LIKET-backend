import { PickType } from '@nestjs/swagger';
import { ReviewEntity } from 'apps/admin-server/src/api/review/entity/review.entity';
import { LiketReviewModel } from 'libs/core/liket/model/liket-review.model';

/**
 * @author jochong
 */
export class LiketReviewEntity extends PickType(ReviewEntity, [
  'visitTime',
  'starRating',
] as const) {
  constructor(data: LiketReviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: LiketReviewModel): LiketReviewEntity {
    return new LiketReviewEntity({
      starRating: model.starRating,
      visitTime: model.visitTime,
    });
  }
}
