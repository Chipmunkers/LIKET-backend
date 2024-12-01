import { IsInt } from 'class-validator';

/**
 * @author jochongs
 */
export class ReportReviewDto {
  /**
   * 신고 유형 인덱스
   *
   * @example 1
   */
  @IsInt()
  typeIdx: number;
}
