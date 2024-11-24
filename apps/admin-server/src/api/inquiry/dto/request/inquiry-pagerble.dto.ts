import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../../common/dto/request/pagerble.dto';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class InquiryPagerbleDto extends PickType(PagerbleDto, ['page', 'order']) {
  /**
   * 검색 분류
   *
   * @example title
   */
  @IsString()
  @IsIn(['title', 'nickname'])
  @IsOptional()
  searchby?: 'title' | 'nickname';

  /**
   * 검색어
   *
   * @example 라이켓
   */
  @IsString()
  @Length(1, 20)
  @IsOptional()
  search?: string;

  /**
   * 문의 유형 인덱스
   *
   * @example 1
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  type?: number;

  /**
   * 답변 상태
   *
   * @example true
   */
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  state?: boolean;
}
