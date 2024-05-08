import { PickType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PickType(CreateReviewDto, [
  'imgList',
  'description',
  'starRating',
  'visitTime',
]) {}
