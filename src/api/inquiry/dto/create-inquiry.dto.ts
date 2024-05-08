import {
  ArrayMaxSize,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/upload-file.dto';
import { Type } from 'class-transformer';

export class CreateInquiryDto {
  @IsString()
  @Length(1, 60)
  title: string;

  @IsString()
  @Length(1, 2000)
  contents: string;

  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  @Type(() => UploadFileDto)
  imgList: UploadFileDto[] = [];

  @IsInt()
  typeIdx: number;
}
