import { ReviewSelectField } from 'libs/core/review/model/prisma/review-select-field';
import { ReviewAuthorModel } from 'libs/core/review/model/review-author.model';
import { ReviewCultureContentModel } from 'libs/core/review/model/review-culture-content.model';
import { ReviewImgModel } from 'libs/core/review/model/review-img.model';

/**
 * @author jochongs
 */
export class ReviewModel {
  /** 리뷰 인덱스 */
  public readonly idx: number;

  /** 리뷰 작성자 */
  public readonly author: ReviewAuthorModel;

  /** 리뷰 컨텐츠 */
  public readonly content: ReviewCultureContentModel;

  /** 방문 시간 */
  public readonly visitTime: Date;

  /** 리뷰 이미지 목록 */
  public readonly imgList: ReviewImgModel[];

  /** 좋아요 여부 */
  public readonly likeState: boolean;

  /** 별점 */
  public readonly starRating: number;

  /** 좋아요 개수 */
  public readonly likeCount: number;

  /** 리뷰 생성 시간 */
  public readonly createdAt: Date;

  /** 리뷰 내용 */
  public readonly description: string;

  /** 신고 개수 */
  public readonly reportCount: number;

  constructor(data: ReviewModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(review: ReviewSelectField): ReviewModel {
    return new ReviewModel({
      idx: review.idx,
      description: review.description,
      starRating: review.starRating,
      visitTime: review.visitTime,
      imgList: review.ReviewImg.map(ReviewImgModel.fromPrisma),
      author: ReviewAuthorModel.fromPrisma(review.User),
      content: ReviewCultureContentModel.fromPrisma(review.CultureContent),
      likeCount: review.likeCount,
      reportCount: review.reportCount,
      createdAt: review.createdAt,
      likeState: !!review.ReviewLike[0],
    });
  }
}
