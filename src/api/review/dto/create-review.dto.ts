import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsIn,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/upload-file.dto';

export class CreateReviewDto {
  /**
   * 별점
   *
   * @example 4
   */
  @IsNumber()
  @IsIn([1, 2, 3, 4, 5])
  starRating: 1 | 2 | 3 | 4 | 5;

  /**
   * 방문 시간
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  @IsDateString()
  visitTime: string;

  /**
   * 업로드할 리뷰 이미지 배열
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  imgList: UploadFileDto[] = [];

  /**
   * 리뷰 설명
   *
   * @example "성수 팝업스토어 디올 뷰티, 들어가자마자 예쁜 야외 정원이 있는데 보기만 해도 아름답다는 말이 나왔어요! 제가 20살 초반에 처음으로 접했던 향수가 디올이기도 했고 개인적으로 코스메틱, 뷰티 브랜드 중 제가 애정하는 브랜드라 더욱 뭉클했어요."
   */
  @IsString()
  @Length(1, 2000)
  description: string;
}
