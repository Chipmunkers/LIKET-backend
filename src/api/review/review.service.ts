import { Injectable, Search } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReviewEntity } from './entity/ReviewEntity';
import { ReviewListPagerbleDto } from './dto/ReviewListPagerbleDto';
import { ReviewListByContentPagerbleDto } from '../culture-content/dto/ReviewListByContentPagerbleDto';
import { UpdateReviewDto } from './dto/UpdateReviewDto';
import { CreateReviewDto } from '../culture-content/dto/CreateReviewDto';
import { ReviewNotFoundException } from './exception/ReviewNotFoundException';
import { ContentNotFoundException } from '../culture-content/exception/ContentNotFound';
import { AlreadyLikeReviewException } from './exception/AlreadyLikeReviewException';
import { AlreadyNotLikeReviewExcpetion } from './exception/AlreadyNotLikeReviewException';
import { ReviewListByUserPagerbleDto } from './dto/ReviewListByUserPagerbleDto';

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
    pagerble: ReviewListByContentPagerbleDto,
  ) => Promise<{
    reviewList: ReviewEntity<'detail', 'user'>[];
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
      reviewList: reviewList.map((review) =>
        ReviewEntity.createDetailUserReviewEntity(review),
      ),
    };
  };

  /**
   * Get all reviews by user idx
   */
  public getReviewAllByUserIdx: (
    userIdx: number,
    loginUserIdx: number,
    pagerble: ReviewListByUserPagerbleDto,
  ) => Promise<{
    reviewList: ReviewEntity<'detail', 'user'>[];
    count: number;
  }> = async (userIdx, loginUserIdx, pagerble) => {
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
              userIdx: loginUserIdx,
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
        take: pagerble.take,
        skip: (pagerble.page - 1) * pagerble.take,
      }),
    ]);

    return {
      reviewList: reviewList.map((review) =>
        ReviewEntity.createDetailUserReviewEntity(review),
      ),
      count,
    };
  };

  /**
   * Get detail review by idx
   */
  public getReviewByIdx: (
    idx: number,
    userIdx: number,
  ) => Promise<ReviewEntity<'detail', 'user'>> = async (reviewIdx, userIdx) => {
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

    return ReviewEntity.createDetailUserReviewEntity(review);
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
              imgPath: img.fileName,
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
              imgPath: img.fileName,
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

  // Admin =====================================================

  /**
   * Get all reviews for admin
   */
  public getReviewAllForAdmin: (pagerble: ReviewListPagerbleDto) => Promise<{
    reviewList: ReviewEntity<'summary', 'admin'>[];
    count: number;
  }> = async (pagerble) => {
    const [reviewList, count] = await this.prisma.$transaction([
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
              userIdx: 0,
            },
          },
          User: true,
          CultureContent: {
            include: {
              User: true,
              ContentImg: {
                where: {
                  deletedAt: null,
                },
                orderBy: {
                  idx: 'asc',
                },
              },
              Genre: true,
              Style: {
                include: {
                  Style: true,
                },
                where: {
                  Style: {
                    deletedAt: null,
                  },
                },
              },
              Age: true,
              Location: true,
            },
          },
        },
        where: {
          idx:
            pagerble.searchby === 'idx' ? Number(pagerble.search) : undefined,
          CultureContent: {
            title:
              pagerble.searchby === 'contents'
                ? {
                    contains: pagerble.search,
                  }
                : undefined,
            deletedAt: null,
            User: {
              deletedAt: null,
            },
          },
          deletedAt: null,
          User: {
            nickname:
              pagerble.searchby === 'nickname'
                ? {
                    contains: pagerble.search,
                  }
                : undefined,
            deletedAt: null,
          },
        },
        orderBy: {
          idx: pagerble.order,
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
      this.prisma.review.count({
        where: {
          idx:
            pagerble.searchby === 'idx' ? Number(pagerble.search) : undefined,
          CultureContent: {
            title:
              pagerble.searchby === 'contents' ? pagerble.search : undefined,
            deletedAt: null,
            User: {
              deletedAt: null,
            },
          },
          deletedAt: null,
          User: {
            nickname:
              pagerble.searchby === 'nickname' ? pagerble.search : undefined,
            deletedAt: null,
          },
        },
      }),
    ]);

    return {
      reviewList: reviewList.map((review) =>
        ReviewEntity.createSummaryAdminReviewEntity(review),
      ),
      count,
    };
  };

  /**
   * Get a detail review by idx for admin
   */
  public getReviewByIdxForAdmin: (
    idx: number,
  ) => Promise<ReviewEntity<'detail', 'admin'>> = async (idx) => {
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
            userIdx: 0,
          },
        },
        User: true,
        CultureContent: {
          include: {
            User: true,
            ContentImg: {
              where: {
                deletedAt: null,
              },
              orderBy: {
                idx: 'asc',
              },
            },
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
        idx,
        CultureContent: {
          deletedAt: null,
          User: {
            deletedAt: null,
          },
        },
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
    });

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    return ReviewEntity.createDetailAdminReviewEntity(review);
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
