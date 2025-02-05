import { Injectable } from '@nestjs/common';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { ReviewPageableDto } from './dto/review-pageable.dto';
import { Prisma, Review } from '@prisma/client';
import { ReviewWithInclude } from './entity/prisma-type/review-with-include';
import { InsertReviewDao } from './dao/insert-review.dao';
import { UpdateReviewDao } from './dao/update-review.dao';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class ReviewRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    @Logger(ReviewRepository.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 리뷰 목록 가져오기. 만약 로그인 사용자가 있다면 로그인 사용자가 신고한 리뷰는 선택되지 않음.
   *
   * @author jochongs
   *
   * @param pagerble 쿼리스트링이 담긴 객체
   * @param userIdx 로그인 사용자 인덱스
   */
  public selectReviewAll(
    pagerble: ReviewPageableDto,
    userIdx?: number,
  ): Promise<ReviewWithInclude[]> {
    const where: Prisma.ReviewWhereInput = {
      cultureContentIdx: pagerble.content,
      userIdx: pagerble.user,
      idx: {
        not: pagerble.review,
      },
      deletedAt: null,
      User: {
        deletedAt: null,
      },
      ReviewReport: userIdx
        ? {
            none: {
              reportUserIdx: userIdx,
            },
          }
        : undefined,
      Liket:
        pagerble.liket === undefined
          ? undefined
          : pagerble.liket
          ? {
              // 라이켓이 존재하는 리뷰만 가져오기
              some: {
                deletedAt: null,
              },
            }
          : {
              // 라이켓이 존재하지 않는 리뷰만 가져오기
              none: {
                deletedAt: null,
              },
            },
    };

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
      take: pagerble.review && pagerble.page === 1 ? 9 : 10,
      skip:
        (pagerble.page - 1) * (pagerble.review && pagerble.page === 1 ? 9 : 10),
    });
  }

  /**
   * 리뷰 자세히보기. 만약 로그인 사용자가 있다면 로그인 사용자가 신고한 리뷰는 선택되지 않고 null을 리턴함.
   *
   * @param idx 리뷰 인덱스
   * @param userIdx
   */
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
        ReviewReport: userIdx
          ? {
              none: {
                reportUserIdx: userIdx,
              },
            }
          : undefined,
      },
    });
  }

  /**
   * 인기 리뷰 목록보기. 7일내로 생성된 리뷰 중 좋아요가 3개 이상인 리뷰 중 좋아요 순으로 5개 가져옴.
   * 로그인 사용자가 있는 경우 신고한 리뷰는 가져오지 않음.
   *
   * @author jochongs
   *
   * @param userIdx 로그인 사용자
   */
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
        ReviewReport: userIdx
          ? {
              none: {
                reportUserIdx: userIdx,
              },
            }
          : undefined,
      },
      orderBy: {
        likeCount: 'desc',
      },
      take: 5,
    });
  }

  /**
   * @author jochongs
   */
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

  /**
   * @author jochongs
   */
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

  /**
   * @author jochongs
   */
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

  /**
   * 리뷰의 신고 횟수를 1 상승시킨다.
   *
   * @author jochongs
   *
   * @param idx 리뷰 인덱스
   * @param tx 트랜잭션, 없는 경우 새로운 트랜잭션 생성
   */
  public increaseReviewCountByIdx(
    idx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Review> {
    return (tx ?? this.prisma).review.update({
      where: {
        idx,
        deletedAt: null,
      },
      data: {
        reportCount: {
          increment: 1,
        },
      },
    });
  }

  /**
   * 리뷰 첫 신고 시간을 현재 시간으로 update하는 메서드
   *
   * @author jochongs
   *
   * @param idx 리뷰 인덱스
   */
  public updateReviewFirstReportedAtByIdx(
    idx: number,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).review.update({
      where: {
        idx,
      },
      data: {
        firstReportedAt: new Date(),
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

  /**
   * 내 프로필을 가져올 때 리뷰 정보를 포함시키기 위한 메서드
   *
   * @author wherehows
   *
   * @param userIdx 사용자 인덱스
   */
  public async selectReviewForMyInfo(userIdx: number) {
    return this.prisma.review.findMany({
      include: {
        ReviewImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
          take: 1,
        },
        CultureContent: {
          include: {
            Genre: true,
            ContentImg: true,
          },
        },
      },
      where: {
        userIdx,
        deletedAt: null,
        CultureContent: {
          acceptedAt: {
            not: null,
          },
          deletedAt: null,
        },
      },
      orderBy: {
        idx: 'desc',
      },
      take: 10,
    });
  }
}
