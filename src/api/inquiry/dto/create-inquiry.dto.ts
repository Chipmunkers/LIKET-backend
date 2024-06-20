import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Length,
} from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @Length(1, 60)
  title: string;

  @IsString()
  @Length(1, 2000)
  contents: string;

  @IsArray()
  @IsString({ each: true })
  @Length(1, 200, { each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(10)
  imgList: string[];

  @IsInt()
  typeIdx: number;
}
