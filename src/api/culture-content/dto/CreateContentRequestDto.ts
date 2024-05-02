import { CreateLocationDto } from '../../../common/dto/CreateLocationDto';
import {
  ArrayMaxSize,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/UploadFileDto';
import { Type } from 'class-transformer';

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

  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  @Type(() => UploadFileDto)
  imgList: UploadFileDto[] = [];

  @IsInt()
  genreIdx: number;

  @IsInt()
  ageIdx: number;

  @IsInt({ each: true })
  @ArrayMaxSize(10)
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
