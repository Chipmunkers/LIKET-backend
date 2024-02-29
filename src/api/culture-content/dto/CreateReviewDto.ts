import {
  IsDateString,
  IsIn,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/UploadFileDto';

export class CreateReviewDto {
  @IsNumber()
  @IsIn([1, 2, 3, 4, 5])
  starRating: 1 | 2 | 3 | 4 | 5;

  @IsDateString()
  visitTime: string;

  @ValidateNested()
  @Length(0, 10)
  imgList: UploadFileDto[];

  @IsString()
  @Length(1, 2000)
  description: string;
}
