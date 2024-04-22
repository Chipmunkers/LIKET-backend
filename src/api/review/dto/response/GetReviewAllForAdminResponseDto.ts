import { ValidateNested } from 'class-validator';
import { ReviewEntity } from '../../entity/ReviewEntity';

export class GetReviewAllForAdminResponseDto {
  @ValidateNested()
  reviewList: ReviewEntity<'summary'>[];

  count: number;
}
