import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  Length,
} from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { ReviewEntity } from '../entity/review.entity';

export class CreateReviewDto extends PickType(ReviewEntity, [
  'visitTime',
  'description',
  'starRating',
] as const) {
  /**
   * 업로드할 리뷰 이미지 배열
   *
   * @example ['/review/img_00001.png']
   */
  @IsArray()
  @IsString({ each: true })
  @Length(1, 200, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  imgList: string[];
}
