import { ValidateNested } from 'class-validator';
import { UserProfileEntity } from '../../user/entity/user-profile.entity';
import { Prisma } from '@prisma/client';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { PickType } from '@nestjs/swagger';
import { ContentEntity } from '../../culture-content/entity/content.entity';

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

class ReviewContent extends PickType(ContentEntity, [
  'idx',
  'title',
  'genre',
  'likeCount',
  'thumbnail',
]) {}

export class SummaryReviewEntity {
  /**
   * 리뷰 인덱스
   *
   * @example 12
   */
  public idx: number;

  /**
   * 방문 시간
   *
   * @example 2024-05-07T12:12:12.000Z
   */
  public visitTime: Date;

  /**
   * 리뷰 썸네일 이미지
   *
   * @example "/review/img_00002.png"
   */
  public thumbnail: string | null;

  /**
   * 문화생활컨텐츠 정보
   */
  public cultureContent: ReviewContent;

  /**
   * 작성자
   */
  public author: UserProfileEntity;

  /**
   * 리뷰 작성 시간
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  public createdAt: Date;

  /**
   * 좋아요 여부
   *
   * @example true
   */
  public likeState: boolean;

  constructor(data: SummaryReviewEntity) {
    Object.assign(this, data);
  }

  static createEntity(review: ReviewWithInclude) {
    return new SummaryReviewEntity({
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
      author: new UserProfileEntity(review.User),
      createdAt: review.createdAt,
      likeState: review.ReviewLike[0] ? true : false,
    });
  }
}
