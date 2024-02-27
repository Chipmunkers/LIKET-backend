import { PickType } from '@nestjs/swagger';
import { CreateReviewDto } from './CreateReviewDto';

export class UpdateReviewDto extends PickType(CreateReviewDto, [
  'imgList',
  'description',
  'starRating',
  'visitTime',
]) {}
