import { ValidateNested } from 'class-validator';
import { ReviewEntity } from '../../../review/entity/ReviewEntity';

export class GetReviewAllResponseDto {
  @ValidateNested()
  reviewList: ReviewEntity<'detail', 'user'>[];
  count: number;
}
