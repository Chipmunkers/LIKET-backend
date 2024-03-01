import {
  ArrayMaxSize,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/UploadFileDto';

export class CreateInquiryDto {
  @IsString()
  @Length(1, 60)
  title: string;

  @IsString()
  @Length(1, 2000)
  contents: string;

  @ValidateNested()
  @ArrayMaxSize(10)
  @IsOptional()
  imgList: UploadFileDto[] = [];

  @IsInt()
  typeIdx: number;
}
