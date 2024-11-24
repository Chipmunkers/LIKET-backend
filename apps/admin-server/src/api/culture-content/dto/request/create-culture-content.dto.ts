import {
  ArrayMaxSize,
  IsBoolean,
  IsDateString,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UploadedFileDto } from '../../../../common/upload/dto/request/uploaded-file.dto';
import { CreateLocationDto } from './create-location.dto';

export class CreateCultureContentDto {
  @IsString()
  @Length(1, 40)
  title: string;

  @IsString()
  @Length(1, 1000)
  description: string;

  @IsString()
  @Length(1, 2000)
  websiteLink: string;

  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  @Type(() => UploadedFileDto)
  imgList: UploadedFileDto[] = [];

  @IsInt()
  genreIdx: number;

  @IsInt()
  ageIdx: number;

  @IsInt({ each: true })
  @ArrayMaxSize(10)
  styleIdxList: number[];

  @ValidateNested()
  @IsObject()
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
