import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetContentPagerbleDto extends PickType(PagerbleDto, [
  'page',
  'order',
]) {
  /**
   * 필터링 할 장르 인덱스
   *
   * @example 1
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  genre?: number;

  /**
   * 필터링 할 연령대 인덱스
   *
   * @example 4
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  age?: number;

  /**
   * 행정동 코드
   *
   * @example "4514069000"
   */
  @IsString()
  @IsOptional()
  region?: string;

  /**
   * 필터링 할 스타일 인덱스
   *
   * @example 3
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  style?: number;

  /**
   * 오픈 여부
   *
   * @example true
   */
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  open?: boolean;

  /**
   * 정렬 방식
   *
   * @example time
   */
  @IsString()
  @IsIn(['time', 'like'])
  @IsOptional()
  orderby: 'time' | 'like' = 'time';

  /**
   * 검색 키워드
   *
   * @example "디올"
   */
  @IsString()
  @IsOptional()
  @Length(1, 10)
  search?: string;
}
