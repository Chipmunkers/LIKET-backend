import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * @author wherehows
 */
export class LiketPageableDto extends PickType(PagerbleDto, ['page'] as const) {
  /**
   * 특정 사용자가 작성한 라이켓 필터링
   *
   * @example 12
   */
  @Type(() => Number)
  @IsInt()
  user: number;

  /**
   * 정렬 요소, 기본값 = time
   *
   * @example time
   * @default time
   */
  @IsString()
  @IsIn(['time'])
  @IsOptional()
  orderby = 'time' as const;

  /**
   * 정렬, 기본값 = asc
   *
   * @example desc
   * @default desc
   */
  @IsString()
  @IsIn(['desc', 'asc'])
  @IsOptional()
  order: 'desc' | 'asc' = 'desc';
}
