import { PickType } from '@nestjs/swagger';
import { SummaryReportedReviewSelectField } from 'libs/core/review/model/prisma/summary-reported-review-select-field';
import { ReportedReviewModel } from 'libs/core/review/model/reported-review.model';
import { ReviewAuthorModel } from 'libs/core/review/model/review-author.model';
import { ReviewCultureContentModel } from 'libs/core/review/model/review-culture-content.model';

/**
 * @author jochongs
 */
export class SummaryReportedReviewModel extends PickType(ReportedReviewModel, [
  'idx',
  'author',
  'content',
  'createdAt',
  'reportCount',
  'firstReportedAt',
  'description',
  'deletedAt',
]) {
  constructor(data: SummaryReportedReviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    reportedReview: SummaryReportedReviewSelectField,
  ): SummaryReportedReviewModel {
    return new SummaryReportedReviewModel({
      idx: reportedReview.idx,
      author: ReviewAuthorModel.fromPrisma(reportedReview.User),
      content: ReviewCultureContentModel.fromPrisma(
        reportedReview.CultureContent,
      ),
      createdAt: reportedReview.createdAt,
      reportCount: reportedReview.reportCount,
      deletedAt: reportedReview.deletedAt,
      description: reportedReview.description,
      firstReportedAt: reportedReview.firstReportedAt,
    });
  }
}
