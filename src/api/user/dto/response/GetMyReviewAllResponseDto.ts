import { ValidateNested } from 'class-validator';
import { ReviewEntity } from '../../../review/entity/ReviewEntity';

export class GetMyReviewAllResponseDto {
  @ValidateNested()
  reviewList: ReviewEntity<'detail'>[];
  count: number;
}
