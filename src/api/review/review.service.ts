import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { ReviewPagerbleDto } from './dto/review-pagerble.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ContentNotFoundException } from '../culture-content/exception/ContentNotFound';
import { AlreadyLikeReviewException } from './exception/AlreadyLikeReviewException';
import { AlreadyNotLikeReviewExcpetion } from './exception/AlreadyNotLikeReviewException';
import { ReviewEntity } from './entity/review.entity';
import { Prisma } from '@prisma/client';
import { LoginUser } from '../auth/model/login-user';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  public getReviewAll: (
    pagerble: ReviewPagerbleDto,
    userIdx?: number,
  ) => Promise<{
    reviewList: ReviewEntity[];
    count: number;
  }> = async (pagerble, userIdx) => {
    const where: Prisma.ReviewWhereInput = {
      cultureContentIdx: pagerble.content,
      userIdx: pagerble.user,
      deletedAt: null,
      User: {
        deletedAt: null,
      },
    };

    const [count, reviewList] = await this.prisma.$transaction([
      this.prisma.review.count({ where }),
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
              userIdx: userIdx || -1,
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
        where,
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

  public getHotReviewAll: (loginUser?: LoginUser) => Promise<ReviewEntity[]> =
    async (loginUser) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const reviewList = await this.prisma.review.findMany({
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
              userIdx: loginUser?.idx || -1,
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
          deletedAt: null,
          CultureContent: {
            deletedAt: null,
            User: {
              blockedAt: null,
              deletedAt: null,
            },
            acceptedAt: {
              not: null,
            },
          },
          User: {
            deletedAt: null,
          },
          createdAt: {
            gte: sevenDaysAgo,
          },
          likeCount: {
            gte: 3,
          },
        },
        orderBy: {
          likeCount: 'desc',
        },
        take: 5,
      });

      return reviewList.map((review) => ReviewEntity.createEntity(review));
    };

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
              imgPath: img,
            })),
          },
        },
        visitTime: new Date(createDto.visitTime),
      },
    });

    return;
  };

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
              imgPath: img,
            })),
          },
        },
        visitTime: new Date(updateDto.visitTime),
      },
    });
  };

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
