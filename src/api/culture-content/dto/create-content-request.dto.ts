import { CreateLocationDto } from './create-location.dto';
import {
  ArrayMaxSize,
  IsInt,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/upload-file.dto';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { ContentEntity } from '../entity/content.entity';

export class CreateContentRequestDto extends PickType(ContentEntity, [
  'title',
  'description',
  'websiteLink',
  'startDate',
  'endDate',
  'openTime',
  'isFee',
  'isReservation',
  'isPet',
  'isParking',
]) {
  /**
   * 컨텐츠 이미지 배열
   */
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  @Type(() => UploadFileDto)
  imgList: UploadFileDto[] = [];

  /**
   * 장르 인덱스
   *
   * @example 5
   */
  @IsInt()
  genreIdx: number;

  /**
   * 연령대 인덱스
   *
   * @example 4
   */
  @IsInt()
  ageIdx: number;

  /**
   * 스타일 인덱스
   *
   * @example [1, 4, 5]
   */
  @IsInt({ each: true })
  @ArrayMaxSize(10)
  styleIdxList: number[];

  /**
   * 컨텐츠 지역
   */
  @ValidateNested()
  @IsObject()
  location: CreateLocationDto;
}
