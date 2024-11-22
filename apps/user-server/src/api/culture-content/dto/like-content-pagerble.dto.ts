import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import { ToBoolean } from '../../../common/decorator/to-boolean.decorator';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class LikeContentPagerbleDto extends PickType(PagerbleDto, ['page']) {
  /**
   * 오픈 중인 컨텐츠 필터링
   */
  @ToBoolean()
  @IsBoolean()
  onlyopen: boolean;

  /**
   * 장르 필터링
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  genre?: number;
}
