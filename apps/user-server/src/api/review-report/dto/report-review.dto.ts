import { IsIn, IsInt } from 'class-validator';
import {
  REVIEW_REPORT_TYPE,
  ReviewReportType,
} from 'libs/core/review/constant/review-report-type';

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
  @IsIn(Object.values(REVIEW_REPORT_TYPE))
  typeIdx: ReviewReportType;
}
