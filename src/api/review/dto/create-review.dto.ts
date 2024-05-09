import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { UploadFileDto } from '../../upload/dto/upload-file.dto';
import { PickType } from '@nestjs/swagger';
import { ReviewEntity } from '../entity/review.entity';

export class CreateReviewDto extends PickType(ReviewEntity, [
  'visitTime',
  'description',
  'starRating',
] as const) {
  /**
   * 업로드할 리뷰 이미지 배열
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  imgList: UploadFileDto[] = [];
}
