import { ValidateNested } from 'class-validator';
import { UserProfileEntity } from '../../user/entity/UserProfileEntity';
import { ContentEntity } from '../../culture-content/entity/ContentEntity';
import { Prisma } from '@prisma/client';
import { TagEntity } from '../../culture-content/entity/TagEntity';
import { PickType } from '@nestjs/swagger';

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
]) {
  constructor(content: {
    idx: number;
    title: string;
    genre: TagEntity;
    likeCount: number;
    thumbnail: string;
  }) {
    super();

    this.idx = content.idx;
    this.title = content.title;
    this.genre = content.genre;
    this.likeCount = content.likeCount;
    this.thumbnail = content.thumbnail;
  }
}

export class ReviewEntity<
  T extends 'summary' | 'detail' = 'detail',
  K extends 'user' | 'admin' = 'user',
> {
  idx: number;
  visitTime: Date;
  thumbnail: string | null;

  @ValidateNested()
  cultureContent: ReviewContent;

  @ValidateNested()
  author: UserProfileEntity;
  createdAt: Date;

  imgList: T extends 'detail' ? string[] : undefined;
  description: T extends 'detail' ? string : undefined;
  starRating: T extends 'detail' ? number : undefined;
  likeCount: T extends 'detail' ? number : undefined;

  likeState: K extends 'user' ? boolean : undefined;

  constructor(data: {
    idx: number;
    visitTime: Date;
    thumbnail: string | null;
    cultureContent: ReviewContent;

    author: UserProfileEntity;
    createdAt: Date;

    imgList: T extends 'detail' ? string[] : undefined;
    description: T extends 'detail' ? string : undefined;
    starRating: T extends 'detail' ? number : undefined;
    likeCount: T extends 'detail' ? number : undefined;

    likeState: K extends 'user' ? boolean : undefined;
  }) {
    this.idx = data.idx;
    this.visitTime = data.visitTime;
    this.thumbnail = data.thumbnail;
    this.cultureContent = data.cultureContent;

    this.author = data.author;
    this.createdAt = data.createdAt;

    this.imgList = data.imgList;
    this.description = data.description;
    this.starRating = data.starRating;
    this.likeCount = data.likeCount;
    this.likeState = data.likeState;
  }

  static createSummaryUserReviewEntity(
    review: ReviewWithInclude,
  ): ReviewEntity<'summary', 'user'> {
    return new ReviewEntity({
      idx: review.idx,
      visitTime: review.visitTime,
      thumbnail: review.ReviewImg[0]?.imgPath || null,
      cultureContent: new ReviewContent({
        idx: review.CultureContent.idx,
        genre: new TagEntity(
          review.CultureContent.Genre.idx,
          review.CultureContent.Genre.name,
        ),
        title: review.CultureContent.title,
        likeCount: review.CultureContent.likeCount,
        thumbnail: review.CultureContent.ContentImg[0]?.imgPath,
      }),
      author: new UserProfileEntity(review.User),
      createdAt: review.createdAt,
      imgList: undefined,
      description: undefined,
      starRating: undefined,
      likeCount: undefined,
      likeState: review.ReviewLike[0] ? true : false,
    });
  }
  static createSummaryAdminReviewEntity(
    review: ReviewWithInclude,
  ): ReviewEntity<'summary', 'admin'> {
    return new ReviewEntity({
      idx: review.idx,
      visitTime: review.visitTime,
      thumbnail: review.ReviewImg[0]?.imgPath || null,
      cultureContent: new ReviewContent({
        idx: review.CultureContent.idx,
        genre: new TagEntity(
          review.CultureContent.Genre.idx,
          review.CultureContent.Genre.name,
        ),
        title: review.CultureContent.title,
        likeCount: review.CultureContent.likeCount,
        thumbnail: review.CultureContent.ContentImg[0]?.imgPath,
      }),
      author: new UserProfileEntity(review.User),
      createdAt: review.createdAt,
      imgList: undefined,
      description: undefined,
      starRating: undefined,
      likeCount: undefined,
      likeState: undefined,
    });
  }
  static createDetailUserReviewEntity(
    review: ReviewWithInclude,
  ): ReviewEntity<'detail', 'user'> {
    return new ReviewEntity({
      idx: review.idx,
      visitTime: review.visitTime,
      thumbnail: review.ReviewImg[0]?.imgPath || null,
      cultureContent: new ReviewContent({
        idx: review.CultureContent.idx,
        genre: new TagEntity(
          review.CultureContent.Genre.idx,
          review.CultureContent.Genre.name,
        ),
        title: review.CultureContent.title,
        likeCount: review.CultureContent.likeCount,
        thumbnail: review.CultureContent.ContentImg[0]?.imgPath,
      }),
      author: new UserProfileEntity(review.User),
      createdAt: review.createdAt,
      imgList: review.ReviewImg.map((img) => img.imgPath),
      description: review.description,
      starRating: review.starRating,
      likeCount: review.likeCount,
      likeState: review.ReviewLike[0] ? true : false,
    });
  }
  static createDetailAdminReviewEntity(
    review: ReviewWithInclude,
  ): ReviewEntity<'detail', 'admin'> {
    return new ReviewEntity({
      idx: review.idx,
      visitTime: review.visitTime,
      thumbnail: review.ReviewImg[0]?.imgPath || null,
      cultureContent: new ReviewContent({
        idx: review.CultureContent.idx,
        genre: new TagEntity(
          review.CultureContent.Genre.idx,
          review.CultureContent.Genre.name,
        ),
        title: review.CultureContent.title,
        likeCount: review.CultureContent.likeCount,
        thumbnail: review.CultureContent.ContentImg[0]?.imgPath,
      }),
      author: new UserProfileEntity(review.User),
      createdAt: review.createdAt,
      imgList: review.ReviewImg.map((img) => img.imgPath),
      description: review.description,
      starRating: review.starRating,
      likeCount: review.likeCount,
      likeState: undefined,
    });
  }
}
