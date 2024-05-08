import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetReviewByContentPagerbleDto } from './dto/get-review-by-content-pagerble.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewNotFoundException } from './exception/ReviewNotFoundException';
import { ContentNotFoundException } from '../culture-content/exception/ContentNotFound';
import { AlreadyLikeReviewException } from './exception/AlreadyLikeReviewException';
import { AlreadyNotLikeReviewExcpetion } from './exception/AlreadyNotLikeReviewException';
import { GetMyReviewAllPagerbleDto } from '../user/dto/get-my-review-all-response.dto';
import { ReviewEntity } from './entity/review.entity';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  // User ======================================================

  /**
   * Get all reviews by culture-content idx
   */
  public getReviewAll: (
    contentIdx: number,
    userIdx: number,
    pagerble: GetReviewByContentPagerbleDto,
  ) => Promise<{
    reviewList: ReviewEntity[];
    count: number;
  }> = async (contentIdx, userIdx, pagerble) => {
    const [count, reviewList] = await this.prisma.$transaction([
      this.prisma.review.count({
        where: {
          cultureContentIdx: contentIdx,
          deletedAt: null,
          User: {
            deletedAt: null,
          },
          CultureContent: {
            deletedAt: null,
            acceptedAt: {
              not: null,
            },
            User: {
              deletedAt: null,
            },
          },
        },
      }),
      this.prisma.review.findMany({
        include: {
          ReviewImg: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              idx: 'asc',
            },
          },
          ReviewLike: {
            where: {
              userIdx,
            },
          },
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
        where: {
          cultureContentIdx: contentIdx,
          deletedAt: null,
          User: {
            deletedAt: null,
          },
          CultureContent: {
            deletedAt: null,
            acceptedAt: {
              not: null,
            },
            User: {
              deletedAt: null,
            },
          },
        },
        orderBy: {
          [pagerble.orderby === 'time' ? 'idx' : 'likeCount']: pagerble.order,
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
    ]);

    return {
      count,
      reviewList: reviewList.map((review) => ReviewEntity.createEntity(review)),
    };
  };

  /**
   * Get all reviews by user idx
   */
  public getReviewAllByUserIdx: (
    userIdx: number,
    pagerble: GetMyReviewAllPagerbleDto,
  ) => Promise<{
    reviewList: ReviewEntity[];
    count: number;
  }> = async (userIdx, pagerble) => {
    const [count, reviewList] = await this.prisma.$transaction([
      this.prisma.review.count({
        where: {
          Liket:
            pagerble.liket === undefined
              ? pagerble.liket
                ? {
                    some: {},
                  }
                : {
                    none: {},
                  }
              : undefined,
          userIdx,
          deletedAt: null,
          CultureContent: {
            deletedAt: null,
            User: {
              deletedAt: null,
              blockedAt: null,
            },
          },
        },
      }),
      this.prisma.review.findMany({
        include: {
          ReviewImg: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              idx: 'asc',
            },
          },
          ReviewLike: {
            where: {
              userIdx,
            },
          },
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
        where: {
          Liket:
            pagerble.liket !== undefined
              ? pagerble.liket
                ? {
                    some: {},
                  }
                : {
                    none: {},
                  }
              : undefined,
          userIdx,
          deletedAt: null,
          CultureContent: {
            deletedAt: null,
            User: {
              deletedAt: null,
              blockedAt: null,
            },
          },
        },
        orderBy: {
          idx: pagerble.order,
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
    ]);

    return {
      reviewList: reviewList.map((review) => ReviewEntity.createEntity(review)),
      count,
    };
  };

  /**
   * Get detail review by idx
   */
  public getReviewByIdx: (
    idx: number,
    userIdx: number,
  ) => Promise<ReviewEntity> = async (reviewIdx, userIdx) => {
    const review = await this.prisma.review.findUnique({
      include: {
        ReviewImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        ReviewLike: {
          where: {
            userIdx,
          },
        },
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
      where: {
        idx: reviewIdx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
        CultureContent: {
          deletedAt: null,
          acceptedAt: {
            not: null,
          },
          User: {
            deletedAt: null,
          },
        },
      },
    });

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    return ReviewEntity.createEntity(review);
  };

  /**
   * Create review with culture-content idx and user idx
   */
  public createReview: (
    contentIdx: number,
    userIdx: number,
    createDto: CreateReviewDto,
  ) => Promise<void> = async (contentIdx, userIdx, createDto) => {
    const content = await this.prisma.cultureContent.findUnique({
      where: {
        idx: contentIdx,
        deletedAt: null,
        acceptedAt: {
          not: null,
        },
        User: {
          deletedAt: null,
          blockedAt: null,
        },
      },
    });

    if (!content) {
      throw new ContentNotFoundException('Cannot find content');
    }

    if (!content.acceptedAt) {
      throw new ContentNotFoundException('Cannot find content');
    }

    await this.prisma.review.create({
      data: {
        userIdx: userIdx,
        cultureContentIdx: content.idx,
        starRating: createDto.starRating,
        description: createDto.description,
        ReviewImg: {
          createMany: {
            data: createDto.imgList.map((img) => ({
              imgPath: img.filePath,
            })),
          },
        },
        visitTime: new Date(createDto.visitTime),
      },
    });

    return;
  };

  /**
   * Update review by idx
   */
  public updateReview: (
    idx: number,
    updateDto: UpdateReviewDto,
  ) => Promise<void> = async (idx, updateDto) => {
    await this.prisma.review.update({
      where: {
        idx,
      },
      data: {
        starRating: updateDto.starRating,
        description: updateDto.description,
        ReviewImg: {
          updateMany: {
            where: {},
            data: {
              deletedAt: new Date(),
            },
          },
          createMany: {
            data: updateDto.imgList.map((img) => ({
              imgPath: img.filePath,
            })),
          },
        },
        visitTime: new Date(updateDto.visitTime),
      },
    });
  };

  /**
   * Delete review by idx
   */
  public deleteReview: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.review.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  };

  // Like ======================================================

  /**
   * Like a review by idx
   */
  public likeReview: (userIdx: number, reviewIdx: number) => Promise<void> =
    async (userIdx, reviewIdx) => {
      const reviewLike = await this.prisma.reviewLike.findUnique({
        where: {
          reviewIdx_userIdx: {
            reviewIdx,
            userIdx,
          },
        },
      });

      if (reviewLike) {
        throw new AlreadyLikeReviewException('Already like review');
      }

      await this.prisma.$transaction([
        this.prisma.reviewLike.create({
          data: {
            reviewIdx,
            userIdx,
          },
        }),
        this.prisma.review.update({
          where: {
            idx: reviewIdx,
          },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        }),
      ]);

      return;
    };

  /**
   * Cancel to like review by idx
   */
  public cancelToLikeReview: (
    userIdx: number,
    reviewIdx: number,
  ) => Promise<void> = async (userIdx, reviewIdx) => {
    const reviewLike = await this.prisma.reviewLike.findUnique({
      where: {
        reviewIdx_userIdx: {
          reviewIdx,
          userIdx,
        },
      },
    });

    if (!reviewLike) {
      throw new AlreadyNotLikeReviewExcpetion('Already do not like review');
    }

    await this.prisma.$transaction([
      this.prisma.reviewLike.delete({
        where: {
          reviewIdx_userIdx: {
            reviewIdx,
            userIdx,
          },
        },
      }),
      this.prisma.review.update({
        where: {
          idx: reviewIdx,
        },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return;
  };
}
