import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ToBoolean } from '../../../common/decorator/to-boolean.decorator';
import { GENRE, Genre } from 'libs/core/tag-root/genre/constant/genre';
import { AGE, Age } from 'libs/core/tag-root/age/constant/age';
import { Style, STYLE } from 'libs/core/tag-root/style/constant/style';

/**
 * @author jochongs
 */
export class ContentPagerbleDto extends PickType(PagerbleDto, [
  'page',
  'order',
]) {
  /**
   * 활성화 여부 (비활성화 컨텐츠를 보는 것은 로그인 본인 user 필터링을 함께 사용했을 경우에만 가능합니다.)
   *
   * @example true
   */
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  accept?: boolean;

  /**
   * 작성자 필터링
   *
   * @example 12
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  user?: number;

  /**
   * 필터링 할 장르 인덱스
   *
   * @example 1
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @IsIn(Object.values(GENRE), { each: true })
  genre?: Genre;

  /**
   * 필터링 할 연령대 인덱스
   *
   * @example 4
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @IsIn(Object.values(AGE), { each: true })
  age?: Age;

  /**
   * 법정동 코드
   *
   * @example "10"
   */
  @IsString()
  @IsOptional()
  @Length(2, 2)
  region?: string;

  /**
   * 필터링 할 스타일 인덱스
   *
   * @example 3
   */
  @Type(() => Number)
  @IsIn(Object.values(STYLE), { each: true })
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(3)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  style?: Style[];

  /**
   * 오픈 여부. false는 현재 작동하지 않음
   *
   * @example true
   */
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  open?: boolean;

  /**
   * 정렬 방식
   * time: accepted_at 기준 (기본 정렬)
   * like: 좋아요 순
   * create: 생성일 기준
   *
   * @example time
   */
  @IsString()
  @IsIn(['time', 'like', 'create'])
  @IsOptional()
  orderby: 'time' | 'like' | 'create' = 'time';

  /**
   * 검색 키워드
   *
   * @example "디올"
   */
  @IsString()
  @IsOptional()
  @Length(1, 100)
  search?: string;
}
