import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class LiketPagerbleDto extends PickType(PagerbleDto, ['page'] as const) {
  /**
   * 특정 사용자가 작성한 라이켓 필터링
   *
   * @example 12
   */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  user?: number;
}
