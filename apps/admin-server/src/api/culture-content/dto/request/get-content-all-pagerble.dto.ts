import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../../common/dto/request/pagerble.dto';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export namespace GetContentPagerbleDto {
  export type OpenState = 'soon-open' | 'continue' | 'soon-end' | 'end';
}

export class GetContentPagerbleDto extends PickType(PagerbleDto, ['page', 'order'] as const) {
  /**
   * 검색 키워드
   *
   * @example "디올 팝업"
   */
  @IsString()
  @Length(1, 20)
  @IsOptional()
  public search?: string;

  /**
   * 검색 분류
   *
   * @example "title"
   */
  @IsString()
  @IsIn(['title', 'user'])
  @IsOptional()
  public searchby?: 'title' | 'user';

  /**
   * 오픈 여부 필터링
   *
   * @example "soon-open"
   */
  @IsString()
  @IsIn(['soon-open', 'continue', 'soon-end', 'end'])
  @IsOptional()
  public state?: 'soon-open' | 'continue' | 'soon-end' | 'end';

  /**
   * 장르 인덱스
   *
   * @example 3
   */
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public genre?: number;

  /**
   * 활성 상태
   *
   * @example true
   */
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  public accept?: boolean;
}
