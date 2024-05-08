import { PickType } from '@nestjs/swagger';
import { CreateReviewDto } from '../../culture-content/dto/create-review.dto';

export class UpdateReviewDto extends PickType(CreateReviewDto, [
  'imgList',
  'description',
  'starRating',
  'visitTime',
]) {}
