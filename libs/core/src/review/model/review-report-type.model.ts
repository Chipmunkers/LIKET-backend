import { ReviewReportType } from 'libs/core/review/constant/review-report-type';
import { ReviewReportTypeAggSelectField } from 'libs/core/review/model/prisma/review-report-type-agg-select-field';

/**
 * @author jochongs
 */
export class ReviewReportTypeAggModel {
  /** 신고 유형 인덱스 */
  public readonly idx: ReviewReportType;

  /** 신고 유형 이름 */
  public readonly name: string;

  /** 신고 개수 */
  public readonly count: number;

  constructor(data: ReviewReportTypeAggModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    type: ReviewReportTypeAggSelectField,
  ): ReviewReportTypeAggModel {
    return new ReviewReportTypeAggModel({
      idx: type.idx as ReviewReportType,
      name: type.name,
      count: type._count.ReviewReport,
    });
  }
}
