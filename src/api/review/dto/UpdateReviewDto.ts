import { PickType } from '@nestjs/swagger';
import { CreateReviewDto } from '../../culture-content/dto/CreateReviewDto';

export class UpdateReviewDto extends PickType(CreateReviewDto, [
  'imgList',
  'description',
  'starRating',
  'visitTime',
]) {}
