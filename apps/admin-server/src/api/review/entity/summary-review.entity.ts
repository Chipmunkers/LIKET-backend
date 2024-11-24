import { PickType } from '@nestjs/swagger';
import { ContentEntity } from '../../culture-content/entity/content.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { Prisma } from '@prisma/client';

const reviewWithInclude = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  include: {
    CultureContent: true,
    ReviewImg: true,
    User: true,
  },
});
type ReviewWithInclude = Prisma.ReviewGetPayload<typeof reviewWithInclude>;

class ReviewAuthorEntity extends PickType(UserEntity, ['idx', 'nickname']) {}

class ReviewContentEntity extends PickType(ContentEntity, ['idx', 'title']) {}

export class SummaryReviewEntity {
  /**
   * 리뷰 인덱스
   *
   * @example 32
   */
  idx: number;

  /**
   * 방문 시간
   *
   * @example 2024-05-03T12:52:00.000Z
   */
  visitTime: Date;

  /**
   * 리뷰 이미지 목록
   *
   * @example ["https://s3.ap-northeast-2.liket/review/img_019481.png", "https://s3.ap-northeast-2.liket/review/img_819028.png"]
   */
  imgList: string[];

  /**
   * 별점
   *
   * @example 4
   */
  starRating: number;

  /**
   * 작성자
   */
  author: ReviewAuthorEntity;

  /**
   * 문화생활컨텐츠
   */
  content: ReviewContentEntity;

  /**
   * 작성 시간
   *
   * @example 2024-05-04T11:12:00.000Z
   */
  createdAt: Date;

  constructor(data: SummaryReviewEntity) {
    Object.assign(this, data);
  }

  static createEntity(review: ReviewWithInclude) {
    return new SummaryReviewEntity({
      idx: review.idx,
      visitTime: review.visitTime,
      imgList: review.ReviewImg.map((reviewImg) => reviewImg.imgPath),
      starRating: review.starRating,
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
