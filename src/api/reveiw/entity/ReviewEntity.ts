import { ValidateNested } from 'class-validator';
import { UserProfileEntity } from '../../user/entity/UserProfileEntity';
import { ContentEntity } from '../../culture-content/entity/ContentEntity';
import { Prisma } from '@prisma/client';
import { TagEntity } from '../../culture-content/entity/TagEntity';

const reviewWithInclude = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  include: {
    ReviewImg: true,
    ReviewLike: true,
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

export class ReviewEntity<
  T extends 'summary' | 'detail' = 'detail',
  K extends 'user' | 'admin' = 'user',
> {
  idx: number;
  visitTime: Date;
  thumbnail: string | null;

  @ValidateNested()
  cultureContent: {
    genre: TagEntity;
  };

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
    cultureContent: ContentEntity<'summary', 'user'>;

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

  static createSummaryUserReviewEntity(review: ReviewWithInclude) {}
  static createSummaryAdminReviewEntity(review: ReviewWithInclude) {}
  static createDetailUserReviewEntity(review: ReviewWithInclude) {}
  static createDetailAdminReviewEntity(review: ReviewWithInclude) {}
}
