import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import { IsIn, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @author jochongs
 */
export class ReviewPageableDto extends PickType(PagerbleDto, [
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

  /**
   * 미리볼 review idx
   *
   * @example 12
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  review?: number;
}
