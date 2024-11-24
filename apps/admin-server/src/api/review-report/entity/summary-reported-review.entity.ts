import { PickType } from '@nestjs/swagger';
import { ReportedReviewEntity } from './reported-review.entity';
import { Prisma } from '@prisma/client';

const reviewWithInclude = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  include: {
    CultureContent: true,
    ReviewImg: true,
    User: true,
  },
});
type ReviewWithInclude = Prisma.ReviewGetPayload<typeof reviewWithInclude>;

/**
 * 신고된 요약 리뷰 엔티티
 *
 * @author jochongs
 */
export class SummaryReportedReviewEntity extends PickType(ReportedReviewEntity, [
  'idx',
  'description',
  'author',
  'reportCount',
  'firstReportedAt',
  'deletedAt',
]) {
  constructor(data: SummaryReportedReviewEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(review: ReviewWithInclude) {
    return new SummaryReportedReviewEntity({
      idx: review.idx,
      description: review.description,
      reportCount: review.reportCount,
      firstReportedAt: review.firstReportedAt,
      deletedAt: review.deletedAt,
      author: {
        idx: review.User.idx,
        nickname: review.User.nickname,
      },
    });
  }
}
