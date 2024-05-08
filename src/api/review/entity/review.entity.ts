import { Prisma } from '@prisma/client';
import { SummaryReviewEntity } from './summary-review.entity';
import { UserProfileEntity } from '../../user/entity/user-profile.entity';
import { TagEntity } from '../../culture-content/entity/tag.entity';

const reviewWithInclude = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  include: {
    ReviewImg: true,
    ReviewLike: true,
    User: true,
    CultureContent: {
      include: {
        User: true,
        ContentImg: true,
        Genre: true,
        Style: {
          include: {
            Style: true,
          },
        },
        Age: true,
        Location: true,
      },
    },
  },
});

type ReviewWithInclude = Prisma.ReviewGetPayload<typeof reviewWithInclude>;

export class ReviewEntity extends SummaryReviewEntity {
  /**
   * 리뷰 이미지 배열
   *
   * @example ["/review/img_00001.png"]
   */
  public imgList: string[];

  /**
   * 리뷰 내용
   *
   * @example "성수 디올 팝업스토어 디올 뷰티, 들어가자 마자 예쁜 야외 정원이 있는"
   */
  public description: string;

  /**
   * 별점
   *
   * @example 4
   */
  public starRating: number;

  /**
   * 좋아요 개수
   *
   * @example 83
   */
  public likeCount: number;

  constructor(data: ReviewEntity) {
    super(data);
    Object.assign(data);
  }

  static createEntity(review: ReviewWithInclude) {
    return new ReviewEntity({
      idx: review.idx,
      visitTime: review.visitTime,
      thumbnail: review.ReviewImg[0]?.imgPath || null,
      cultureContent: {
        idx: review.CultureContent.idx,
        genre: TagEntity.createEntity(review.CultureContent.Genre),
        title: review.CultureContent.title,
        likeCount: review.CultureContent.likeCount,
        thumbnail: review.CultureContent.ContentImg[0]?.imgPath,
      },
      author: UserProfileEntity.createEntity(review.User),
      createdAt: review.createdAt,
      imgList: review.ReviewImg.map((img) => img.imgPath),
      description: review.description,
      starRating: review.starRating,
      likeCount: review.likeCount,
      likeState: review.ReviewLike[0] ? true : false,
    });
  }
}
