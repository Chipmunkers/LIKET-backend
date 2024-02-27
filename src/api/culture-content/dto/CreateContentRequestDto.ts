import { CreateLocationDto } from '../../../common/dto/CreateLocationDto';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsISO8601,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/UploadFileDto';

export class CreateContentRequestDto {
  @IsString()
  @Length(1, 40)
  title: string;

  @IsString()
  @Length(1, 200)
  description: string;

  @IsString()
  @Length(1, 2000)
  websiteLink: string;

  @ValidateNested()
  @Length(0, 10)
  @IsOptional()
  imgList?: UploadFileDto[];

  @IsInt()
  genreIdx: number;

  @IsInt()
  ageIdx: number;

  @IsNumber({}, { each: true })
  @Length(0, 10)
  styleIdxList: number[];

  @ValidateNested()
  location: CreateLocationDto;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  openTime: string;

  @IsBoolean()
  isFee: boolean;

  @IsBoolean()
  isReservation: boolean;

  @IsBoolean()
  isPet: boolean;

  @IsBoolean()
  isParking: boolean;
}
