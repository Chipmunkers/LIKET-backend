import { PickType } from '@nestjs/swagger';
import { ReviewEntity } from '../../review/entity/ReviewEntity';
import { ValidateNested } from 'class-validator';
import { ContentEntity } from '../../culture-content/entity/ContentEntity';
import { UserProfileEntity } from '../../user/entity/UserProfileEntity';
import { TagEntity } from '../../culture-content/entity/TagEntity';
import { LocationEntity } from '../../culture-content/entity/LocationEntity';
import { Prisma } from '@prisma/client';

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
]) {
  constructor(review: {
    idx: number;
    starRating: number;
    visitTime: Date;
    thumbnail: string | null;
    createdAt: Date;
  }) {
    super();

    this.idx = review.idx;
    this.starRating = review.starRating;
    this.visitTime = review.visitTime;
    this.thumbnail = review.thumbnail;
    this.createdAt = review.createdAt;
  }
}

class LiketContent extends PickType(ContentEntity, [
  'idx',
  'title',
  'genre',
  'location',
  'thumbnail',
]) {
  constructor(content: {
    idx: number;
    title: string;
    genre: TagEntity;
    location: LocationEntity;
    thumbnail: string | null;
  }) {
    super();

    this.idx = content.idx;
    this.title = content.title;
    this.genre = content.genre;
    this.location = content.location;
    this.thumbnail = content.thumbnail;
  }
}

export class LiketEntity<T extends 'detail' | 'summary' = 'detail'> {
  idx: number;
  description: T extends 'detail' ? string : undefined;

  @ValidateNested()
  review: LiketReview;

  @ValidateNested()
  cultureContent: LiketContent;

  @ValidateNested()
  author: UserProfileEntity;

  createdAt: Date;

  constructor(liket: {
    idx: number;
    description: T extends 'detail' ? string : undefined;
    review: LiketReview;
    cultureContent: LiketContent;
    author: UserProfileEntity;
    createdAt: Date;
  }) {
    this.idx = liket.idx;
    this.description = liket.description;
    this.review = liket.review;
    this.cultureContent = liket.cultureContent;
    this.author = liket.author;
    this.createdAt = liket.createdAt;
  }

  static createDetailLiket(liket: LiketWithInclude): LiketEntity<'detail'> {
    const review = liket.Review;
    const content = review.CultureContent;
    const author = liket.User;

    return new LiketEntity<'detail'>({
      idx: liket.idx,
      description: liket.description,
      review: new LiketReview({
        idx: review.idx,
        starRating: review.starRating,
        visitTime: review.visitTime,
        thumbnail: review.ReviewImg[0]?.imgPath || null,
        createdAt: review.createdAt,
      }),
      cultureContent: new LiketContent({
        idx: content.idx,
        title: content.title,
        genre: new TagEntity(content.Genre.idx, content.Genre.name),
        location: LocationEntity.createDetailLocation(content.Location),
        thumbnail: content.ContentImg[0]?.imgPath || null,
      }),
      author: new UserProfileEntity({
        idx: author.idx,
        nickname: author.nickname,
        profileImgPath: author.profileImgPath,
        provider: author.provider,
      }),
      createdAt: liket.createdAt,
    });
  }

  static createSummaryLiket(liket: LiketWithInclude): LiketEntity<'summary'> {
    const review = liket.Review;
    const content = review.CultureContent;
    const author = liket.User;

    return new LiketEntity<'summary'>({
      idx: liket.idx,
      description: undefined,
      review: new LiketReview({
        idx: review.idx,
        starRating: review.starRating,
        visitTime: review.visitTime,
        thumbnail: review.ReviewImg[0]?.imgPath || null,
        createdAt: review.createdAt,
      }),
      cultureContent: new LiketContent({
        idx: content.idx,
        title: content.title,
        genre: new TagEntity(content.Genre.idx, content.Genre.name),
        location: LocationEntity.createDetailLocation(content.Location),
        thumbnail: content.ContentImg[0]?.imgPath || null,
      }),
      author: new UserProfileEntity({
        idx: author.idx,
        nickname: author.nickname,
        profileImgPath: author.profileImgPath,
        provider: author.provider,
      }),
      createdAt: liket.createdAt,
    });
  }
}
