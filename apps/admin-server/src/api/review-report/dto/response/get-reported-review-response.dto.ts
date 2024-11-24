import { SummaryReportedReviewEntity } from '../../entity/summary-reported-review.entity';

export class GetReportedReviewResponseDto {
  reviewList: SummaryReportedReviewEntity[];

  /**
   * 검색된 총 개수
   *
   * @example 3
   */
  count: number;
}
