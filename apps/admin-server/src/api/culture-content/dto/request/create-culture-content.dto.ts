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
  @Length(1, 60)
  title: string;

  @IsString()
  @Length(1, 2000)
  @IsOptional()
  description: string | null = null;

  @IsString()
  @Length(1, 2000)
  @IsOptional()
  websiteLink: string | null = null;

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
  @IsOptional()
  endDate: string | null = null;

  @IsString()
  @Length(1, 1000)
  @IsOptional()
  openTime: string | null = null;

  @IsBoolean()
  isFee: boolean;

  @IsBoolean()
  isReservation: boolean;

  @IsBoolean()
  isPet: boolean;

  @IsBoolean()
  isParking: boolean;
}
