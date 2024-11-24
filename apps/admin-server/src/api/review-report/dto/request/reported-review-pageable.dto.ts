import { IsIn, IsOptional, IsString, Length } from 'class-validator';
import { PagerbleDto } from '../../../../common/dto/request/pagerble.dto';
import { PickType } from '@nestjs/swagger';

/**
 * 신고된 리뷰 필터링용 쿼리스트링
 *
 * @author jochongs
 */
export class ReportedReviewPageableDto extends PickType(PagerbleDto, ['page', 'order']) {
  /**
   * 검색 키워드
   *
   * @example 팝업스토어
   */
  @IsString()
  @Length(1, 20)
  @IsOptional()
  search?: string;

  /**
   * 무엇으로 검색할지
   *
   * @example author
   */
  @IsString()
  @IsIn(['review', 'author'])
  @IsOptional()
  searchby?: 'review' | 'author';

  /**
   * 리뷰 신고 상태
   *
   * @example 'complete'
   */
  @IsString()
  @IsIn(['complete', 'wait'])
  @IsOptional()
  state?: 'complete' | 'wait';
}
