import { ReviewEntity } from '../../../review/entity/review.entity';

export class GetReviewAllResponseDto {
  reviewList: ReviewEntity[];
  count: number;
}
