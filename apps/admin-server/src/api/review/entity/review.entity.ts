import { Prisma } from '@prisma/client';
import { SummaryReviewEntity } from './summary-review.entity';

const reviewWithInclude = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  include: {
    CultureContent: true,
    ReviewImg: true,
    User: true,
  },
});
type ReviewWithInclude = Prisma.ReviewGetPayload<typeof reviewWithInclude>;

export class ReviewEntity extends SummaryReviewEntity {
  /**
   * 리뷰 내용
   *
   * @example "성수 디올 팝업스토어는 어떤 곳이고\n어떤 이벤트가 진행중입니다~~~"
   */
  description: string;

  /**
   * 신고 받은 개수
   *
   * @example 12
   */
  reportCount: number;

  constructor(data: ReviewEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(review: ReviewWithInclude) {
    return new ReviewEntity({
      idx: review.idx,
      visitTime: review.visitTime,
      imgList: review.ReviewImg.map((reviewImg) => reviewImg.imgPath),
      description: review.description,
      starRating: review.starRating,
      reportCount: review.reportCount,
      author: {
        idx: review.User.idx,
        nickname: review.User.nickname,
      },
      content: {
        idx: review.CultureContent.idx,
        title: review.CultureContent.title,
      },
      createdAt: review.createdAt,
    });
  }
}
