import { PickType } from '@nestjs/swagger';
import { ReviewEntity } from '../../review/entity/review.entity';
import { ContentEntity } from '../../culture-content/entity/content.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { Prisma } from '@prisma/client';
import { LocationEntity } from '../../culture-content/entity/location.entity';
import { TagEntity } from '../../culture-content/entity/tag.entity';

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
  'imgList',
  'createdAt',
] as const) {}

class LiketCultureContent extends PickType(ContentEntity, [
  'idx',
  'title',
  'genre',
  'location',
  'imgList',
] as const) {}

class LiketAuthor extends PickType(UserEntity, ['idx', 'nickname', 'profileImgPath'] as const) {}

export class LiketEntity {
  /**
   * 라이켓 인덱스
   *
   * @example 18
   */
  idx: number;

  /**
   * 라이켓 리뷰
   */
  review: LiketReview;

  /**
   * 라이켓 문화생활컨텐츠
   */
  cultureContent: LiketCultureContent;

  /**
   * 라이켓 설명
   *
   * @example 낮엔 되게 비싸보이는데\n밤엔 엄청 비싸보이는 디올
   */
  description: string;

  /**
   * 작성자
   */
  author: LiketAuthor;

  /**
   * 라이켓 생성일
   *
   * @example 2024-02-12T10:10:12.000Z
   */
  createdAt: Date;

  constructor(data: LiketEntity) {
    Object.assign(this, data);
  }

  static createEntity(liket: LiketWithInclude) {
    const review = liket.Review;
    const content = review.CultureContent;
    const author = liket.User;

    return new LiketEntity({
      idx: liket.idx,
      description: liket.description,
      review: {
        idx: review.idx,
        starRating: review.starRating,
        visitTime: review.visitTime,
        createdAt: review.createdAt,
        imgList: review.ReviewImg.map((img) => img.imgPath),
      },
      cultureContent: {
        idx: content.idx,
        title: content.title,
        genre: TagEntity.createEntity(content.Genre),
        location: LocationEntity.createEntity(content.Location),
        imgList: content.ContentImg.map((img) => img.imgPath),
      },
      author: {
        idx: author.idx,
        nickname: author.nickname,
        profileImgPath: author.profileImgPath,
      },
      createdAt: liket.createdAt,
    });
  }
}
