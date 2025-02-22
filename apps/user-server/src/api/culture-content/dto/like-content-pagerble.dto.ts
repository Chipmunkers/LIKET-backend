import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import { ToBoolean } from '../../../common/decorator/to-boolean.decorator';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { GENRE, Genre } from 'libs/core/tag-root/genre/constant/genre';

/**
 * @author jochongs
 */
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
  @IsIn(Object.values(GENRE))
  @IsOptional()
  genre?: Genre;
}
