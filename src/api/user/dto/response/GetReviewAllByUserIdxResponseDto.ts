import { ValidateNested } from 'class-validator';
import { ReviewEntity } from '../../../review/entity/ReviewEntity';

export class GetReviewAllByUseridxResponseDto {
  @ValidateNested()
  reviewList: ReviewEntity<'detail', 'user'>[];
  count: number;
}
