import { PickType } from '@nestjs/swagger';
import { UserProfileEntity } from '../../user/entity/user-profile.entity';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { Prisma } from '@prisma/client';
import { ReviewEntity } from '../../review/entity/review.entity';
import { ContentEntity } from '../../culture-content/entity/content.entity';
import { LocationEntity } from '../../culture-content/entity/location.entity';

const liketWithInclude = Prisma.validator<Prisma.LiketDefaultArgs>()({
  include: {
    Review: {
      include: {
        CultureContent: {
          include: {
            Genre: true,
            Location: true,
            ContentImg: true,
          },
        },
        ReviewImg: true,
      },
    },
    User: true,
  },
});

type LiketWithInclude = Prisma.LiketGetPayload<typeof liketWithInclude>;

class LiketReview extends PickType(ReviewEntity, [
  'idx',
  'starRating',
  'visitTime',
  'thumbnail',
  'createdAt',
]) {}

class LiketContent extends PickType(ContentEntity, [
  'idx',
  'title',
  'genre',
  'location',
  'thumbnail',
]) {}

export class SummaryLiketEntity {
  /**
   * 라이켓 인덱스
   *
   * @example 23
   */
  public idx: number;

  /**
   * 라이켓 이미지 경로
   *
   * @example /liket/img_000001.png
   */
  public imgPath: string;

  /**
   * 리뷰
   */
  public review: LiketReview;

  /**
   * 컨텐츠
   */
  public cultureContent: LiketContent;

  /**
   * 작성자
   */
  public author: UserProfileEntity;

  /**
   * 생성일
   */
  public createdAt: Date;

  constructor(liket: SummaryLiketEntity) {
    Object.assign(this, liket);
  }

  static createEntity(liket: LiketWithInclude) {
    const review = liket.Review;
    const content = review.CultureContent;
    const author = liket.User;

    return new SummaryLiketEntity({
      idx: liket.idx,
      imgPath: liket.imgPath,
      review: {
        idx: review.idx,
        starRating: review.starRating,
        visitTime: review.visitTime,
        thumbnail: review.ReviewImg[0]?.imgPath || '',
        createdAt: review.createdAt,
      },
      cultureContent: {
        idx: content.idx,
        title: content.title,
        genre: TagEntity.createEntity(content.Genre),
        location: LocationEntity.createEntity(content.Location),
        thumbnail: content.ContentImg[0]?.imgPath || '',
      },
      author: {
        idx: author.idx,
        nickname: author.nickname,
        profileImgPath: author.profileImgPath,
        provider: author.provider,
      },
      createdAt: liket.createdAt,
    });
  }
}
