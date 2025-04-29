import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { ContentEntity } from '../entity/content.entity';
import { LocationEntity } from '../entity/location.entity';
import { Type } from 'class-transformer';
import { GENRE, Genre } from 'libs/core/tag-root/genre/constant/genre';
import { Age, AGE } from 'libs/core/tag-root/age/constant/age';
import { Style, STYLE } from 'libs/core/tag-root/style/constant/style';

/**
 * @author jochongs
 */
export class CreateContentRequestDto extends PickType(ContentEntity, [
  'title',
  'description',
  'websiteLink',
  'openTime',
  'isFee',
  'isReservation',
  'isPet',
  'isParking',
]) {
  /**
   * 컨텐츠 이미지 배열
   *
   * @example ["/culture-content/00001.png", "/culture-content/00002.png"]
   */
  @IsArray()
  @IsString({ each: true })
  @Length(1, 200, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  imgList: string[];

  /**
   * 장르 인덱스
   *
   * @example 5
   */
  @IsIn(Object.values(GENRE))
  genreIdx: Genre;

  /**
   * 연령대 인덱스
   *
   * @example 4
   */
  @IsIn(Object.values(AGE))
  ageIdx: Age;

  /**
   * 스타일 인덱스
   *
   * @example [1, 4, 5]
   */
  @IsInt({ each: true })
  @ArrayMaxSize(10)
  @IsIn(Object.values(STYLE), { each: true })
  styleIdxList: Style[];

  /**
   * 컨텐츠 지역
   */
  @ValidateNested()
  @IsObject()
  @Type(() => LocationEntity)
  location: LocationEntity;

  /**
   * 시작 날짜
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  @IsDateString()
  public startDate: string;

  /**
   * 끝나는 날짜
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  @IsDateString()
  @IsOptional()
  public endDate: string | null;
}
