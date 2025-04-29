import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsString,
  Length,
} from 'class-validator';
import {
  INQUIRY_TYPE,
  InquiryType,
} from 'libs/core/inquiry/constant/inquiry-type';

/**
 * @author jochongs
 */
export class CreateInquiryDto {
  @IsString()
  @Length(1, 30)
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
  @IsIn(Object.values(INQUIRY_TYPE))
  typeIdx: InquiryType;
}
