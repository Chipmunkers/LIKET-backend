import { PickType } from '@nestjs/swagger';
import { ReportedReviewSelectField } from 'libs/core/review/model/prisma/reported-review-select-field';
import { ReviewReportTypeAggSelectField } from 'libs/core/review/model/prisma/review-report-type-agg-select-field';
import { ReviewAuthorModel } from 'libs/core/review/model/review-author.model';
import { ReviewCultureContentModel } from 'libs/core/review/model/review-culture-content.model';
import { ReviewImgModel } from 'libs/core/review/model/review-img.model';
import { ReviewReportTypeAggModel } from 'libs/core/review/model/review-report-type.model';
import { ReviewModel } from 'libs/core/review/model/review.model';

/**
 * @author jochongs
 */
export class ReportedReviewModel extends PickType(ReviewModel, [
  'idx',
  'author',
  'content',
  'visitTime',
  'imgList',
  'starRating',
  'likeCount',
  'createdAt',
  'description',
  'reportCount',
]) {
  /** 신고 유형별 신고 개수 목록 */
  public readonly typeList: ReviewReportTypeAggModel[];

  /** 삭제 처리된 시간 */
  public readonly deletedAt: Date | null;

  /** 최초 신고일 */
  public readonly firstReportedAt: Date | null;

  constructor(data: ReportedReviewModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    reportedReview: ReportedReviewSelectField,
    typeList: ReviewReportTypeAggSelectField[],
  ): ReportedReviewModel {
    return new ReportedReviewModel({
      idx: reportedReview.idx,
      author: ReviewAuthorModel.fromPrisma(reportedReview.User),
      content: ReviewCultureContentModel.fromPrisma(
        reportedReview.CultureContent,
      ),
      visitTime: reportedReview.visitTime,
      imgList: reportedReview.ReviewImg.map(ReviewImgModel.fromPrisma),
      likeCount: reportedReview.likeCount,
      createdAt: reportedReview.createdAt,
      description: reportedReview.description,
      reportCount: reportedReview.reportCount,
      deletedAt: reportedReview.deletedAt,
      firstReportedAt: reportedReview.firstReportedAt,
      starRating: reportedReview.starRating,
      typeList: typeList.map(ReviewReportTypeAggModel.fromPrisma),
    });
  }
}
