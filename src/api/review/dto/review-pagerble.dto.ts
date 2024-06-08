import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewPagerbleDto extends PickType(PagerbleDto, [
  'page',
  'order',
]) {
  /**
   * 특정 사용자의 리뷰 필터링
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  user?: number;

  /**
   * 특정 컨텐츠의 리뷰 필터링
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  content?: number;

  /**
   * 정렬 요소
   *
   * @example time
   */
  @IsString()
  @IsIn(['time', 'like'])
  orderby: 'time' | 'like' = 'time';
}
