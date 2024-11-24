import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../../common/dto/request/pagerble.dto';
import { IsIn, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class GetDeleteReasonPagerbleDto extends PickType(PagerbleDto, ['page', 'order'] as const) {
  /**
   * 검색 종류
   *
   * @example contents
   */
  @IsString()
  @IsIn(['contents'])
  @IsOptional()
  public searchby?: 'contents';

  /**
   * 검색어
   *
   * @example 재미
   */
  @IsString()
  @Length(1, 20)
  @IsOptional()
  public search?: string;

  /**
   * 탈퇴 사유 타입 인덱스
   *
   * @exmaple 2
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public type?: number;
}
