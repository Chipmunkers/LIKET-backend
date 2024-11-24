import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../../common/dto/request/pagerble.dto';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class GetUserAllPagerbleDto extends PickType(PagerbleDto, ['page', 'order'] as const) {
  /**
   * 검색 조건 (닉네임 또는 이메일)
   */
  @IsString()
  @IsIn(['nickname', 'email'])
  @IsOptional()
  searchby?: 'nickname' | 'email';

  /**
   * 검색 키워드
   */
  @IsString()
  @Length(1, 20)
  @IsOptional()
  search?: string;

  /**
   * 필터링
   */
  @IsString()
  @IsIn(['block', 'active'])
  @IsOptional()
  filterby?: 'block' | 'active';
}
