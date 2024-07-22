import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { ReviewPagerbleDto } from './dto/review-pagerble.dto';
import { Prisma } from '@prisma/client';
import { ReviewWithInclude } from './entity/prisma-type/review-with-include';
import { InsertReviewDao } from './dao/insert-review.dao';
import { UpdateReviewDao } from './dao/update-review.dao';

@Injectable()
export class ReviewRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(ReviewRepository.name) private readonly logger: LoggerService,
  ) {}

  public selectReviewAll(
    pagerble: ReviewPagerbleDto,
    withCount: true,
    userIdx?: number,
  ): Promise<[ReviewWithInclude[], number]>;
  public selectReviewAll(
    pagerble: ReviewPagerbleDto,
    withCount: false,
    userIdx?: number,
  ): Promise<ReviewWithInclude[]>;
  public selectReviewAll(
    pagerble: ReviewPagerbleDto,
    withCount: boolean,
    userIdx?: number,
  ): Promise<[ReviewWithInclude[], number] | ReviewWithInclude[]> {
    const where: Prisma.ReviewWhereInput = {
      cultureContentIdx: pagerble.content,
      userIdx: pagerble.user,
      deletedAt: null,
      User: {
        deletedAt: null,
      },
    };

    if (withCount) {
      this.logger.log(this.selectReviewAll, 'SELECT review, count');
      return this.prisma.$transaction([
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
        this.prisma.review.count({ where }),
      ]);
    }

    this.logger.log(this.selectReviewAll, 'SELECT review');
    return this.prisma.review.findMany({
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
    });
  }

  public selectReviewByIdx(idx: number, userIdx?: number) {
    this.logger.log(this.selectReviewByIdx, `SELECT review WHERE idx = ${idx}`);
    return this.prisma.review.findUnique({
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
      where: {
        idx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
        CultureContent: {
          acceptedAt: {
            not: null,
          },
          deletedAt: null,
        },
      },
    });
  }

  public selectHotReviewAll(userIdx?: number) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    this.logger.log(this.selectHotReviewAll, 'SELECT hot review');
    return this.prisma.review.findMany({
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
  }

  public selectReviewAvgStarRatingByContentIdx(contentIdx: number) {
    this.logger.log(
      this.selectReviewAvgStarRatingByContentIdx,
      `SELECT avg star rating WHERE content_idx = ${contentIdx}`,
    );
    return this.prisma.review.aggregate({
      _sum: {
        starRating: true,
      },
      where: {
        cultureContentIdx: contentIdx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
    });
  }

  public insertReview(dao: InsertReviewDao) {
    this.logger.log(this.insertReview, 'INSERT review');
    return this.prisma.review.create({
      data: {
        userIdx: dao.userIdx,
        cultureContentIdx: dao.contentIdx,
        starRating: dao.starRating,
        description: dao.description,
        ReviewImg: {
          createMany: {
            data: dao.imgList.map((img) => ({
              imgPath: img,
            })),
          },
        },
        visitTime: dao.visitTime,
      },
    });
  }

  public updateReviewByIdx(idx: number, dao: UpdateReviewDao) {
    this.logger.log(this.updateReviewByIdx, `UPDATE review WHERE idx = ${idx}`);
    return this.prisma.review.update({
      where: {
        idx,
      },
      data: {
        starRating: dao.starRating,
        description: dao.description,
        ReviewImg: {
          updateMany: {
            where: {},
            data: {
              deletedAt: new Date(),
            },
          },
          createMany: {
            data: dao.imgList.map((img) => ({
              imgPath: img,
            })),
          },
        },
        visitTime: new Date(dao.visitTime),
      },
    });
  }

  public deleteReviewByIdx(idx: number) {
    this.logger.log(
      this.deleteReviewByIdx,
      `SOFT DELETE review WHERE idx = ${idx}`,
    );
    return this.prisma.review.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
