import {
  ArrayMaxSize,
  IsDateString,
  IsIn,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/UploadFileDto';
import { Optional } from '@nestjs/common';

export class CreateReviewDto {
  @IsNumber()
  @IsIn([1, 2, 3, 4, 5])
  starRating: 1 | 2 | 3 | 4 | 5;

  @IsDateString()
  visitTime: string;

  @ValidateNested()
  @ArrayMaxSize(10)
  @Optional()
  imgList: UploadFileDto[] = [];

  @IsString()
  @Length(1, 2000)
  description: string;
}
