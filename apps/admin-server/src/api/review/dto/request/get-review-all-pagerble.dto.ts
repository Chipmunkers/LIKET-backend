import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../../common/dto/request/pagerble.dto';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class GetReviewAllPagerbleDto extends PickType(PagerbleDto, ['page', 'order']) {
  /**
   * 검색 분류
   *
   * @example nickname
   */
  @IsString()
  @IsIn(['nickname', 'content', 'description'])
  @IsOptional()
  searchby?: 'nickname' | 'content' | 'description';

  /**
   * 검색 키워드
   *
   * @example 성수
   */
  @IsString()
  @IsOptional()
  @Length(1, 20)
  search?: string;
}
