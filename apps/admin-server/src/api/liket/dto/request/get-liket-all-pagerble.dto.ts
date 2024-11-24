import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../../common/dto/request/pagerble.dto';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class GetLiketAllPagerbleDto extends PickType(PagerbleDto, ['page', 'order'] as const) {
  /**
   * 검색 분류
   *
   * @example nickname
   */
  @IsString()
  @IsIn(['nickname', 'review'])
  @IsOptional()
  searchby?: 'nickname' | 'review';

  /**
   * 검색어
   *
   * @exmaple "디올 팝업"
   */
  @IsString()
  @Length(1, 20)
  @IsOptional()
  search?: string;
}
