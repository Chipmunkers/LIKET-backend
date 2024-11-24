import { OmitType, PickType } from '@nestjs/swagger';
import { ReviewEntity } from '../../review/entity/review.entity';
import { ReviewReportTypeEntity } from './review-report-type.entity';
import { Prisma, PrismaClient } from '@prisma/client';

const reviewWithInclude = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  include: {
    CultureContent: true,
    ReviewImg: true,
    User: true,
  },
});
type ReviewWithInclude = Prisma.ReviewGetPayload<typeof reviewWithInclude>;

const reviewReportTypeWithInclude = Prisma.validator<Prisma.ReviewReportTypeDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    _count: {
      select: {
        ReviewReport: true,
      },
    },
  },
});
type ReviewReportTypeWithInclude = Prisma.ReviewReportTypeGetPayload<
  typeof reviewReportTypeWithInclude
>;

/**
 * 신고된 리뷰 엔티티
 *
 * @author jochongs
 */
export class ReportedReviewEntity extends PickType(ReviewEntity, [
  'idx',
  'visitTime',
  'imgList',
  'description',
  'starRating',
  'author',
  'content',
  'createdAt',
  'reportCount',
]) {
  /**
   * 신고 유형별 신고 개수.
   */
  typeList: ReviewReportTypeEntity[];

  /**
   * 삭제 처리 여부
   *
   * @example 2024-05-04T11:12:00.000Z
   */
  deletedAt: Date | null;

  /**
   * 최초 신고일
   *
   * @example 2024-05-04T11:12:00.000Z
   */
  firstReportedAt: Date;

  constructor(reportedReviewEntity: ReportedReviewEntity) {
    super();
    Object.assign(this, reportedReviewEntity);
  }

  static async createEntity(
    review: ReviewWithInclude,
    reviewReportTypeList: ReviewReportTypeWithInclude[],
  ) {
    return new ReportedReviewEntity({
      idx: review.idx,
      visitTime: review.visitTime,
      imgList: review.ReviewImg.map((reviewImg) => reviewImg.imgPath),
      description: review.description,
      starRating: review.starRating,
      reportCount: review.reportCount,
      deletedAt: review.deletedAt,
      firstReportedAt: review.firstReportedAt,
      author: {
        idx: review.User.idx,
        nickname: review.User.nickname,
      },
      content: {
        idx: review.CultureContent.idx,
        title: review.CultureContent.title,
      },
      createdAt: review.createdAt,
      typeList: reviewReportTypeList.map((type) => ({
        count: type._count.ReviewReport,
        idx: type.idx,
        name: type.name,
      })),
    });
  }
}
