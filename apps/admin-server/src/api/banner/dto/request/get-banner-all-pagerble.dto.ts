import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../../common/dto/request/pagerble.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class GetBannerAllPagerbleDto extends PickType(PagerbleDto, ['page', 'order'] as const) {
  /**
   * 검색 키워드
   *
   * @example 팝업스토어
   */
  @IsString()
  @Length(1, 12)
  @IsOptional()
  search?: string;
}
