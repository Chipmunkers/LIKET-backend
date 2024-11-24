import { Injectable } from '@nestjs/common';
import { GetReviewAllPagerbleDto } from './dto/request/get-review-all-pagerble.dto';
import { SummaryReviewEntity } from '../review/entity/summary-review.entity';
import { Prisma } from '../../common/prisma/prisma.service';
import { GetLiketAllPagerbleDto } from './dto/request/get-liket-all-pagerble.dto';
import { LiketEntity } from '../liket/entity/liket.entity';
import { ReviewEntity } from '../review/entity/review.entity';

@Injectable()
export class UserHistoryService {
  constructor(private readonly prisma: Prisma) {}

  getReviewByUserIdx: (
    userIdx: number,
    pagerble: GetReviewAllPagerbleDto,
  ) => Promise<{
    reviewList: ReviewEntity[];
    count: number;
  }> = async (userIdx, pagerble) => {
    const [reviewList, count] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        include: {
          CultureContent: true,
          ReviewImg: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              idx: 'asc',
            },
          },
          User: true,
        },
        where: {
          userIdx,
          CultureContent: {
            deletedAt: null,
          },
          deletedAt: null,
        },
        orderBy: {
          idx: 'desc',
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
      this.prisma.review.count({
        where: {
          userIdx,
          CultureContent: {
            deletedAt: null,
          },
          deletedAt: null,
        },
      }),
    ]);

    return {
      reviewList: reviewList.map((review) => ReviewEntity.createEntity(review)),
      count,
    };
  };

  getLiketByUserIdx: (
    userIdx: number,
    pagerble: GetLiketAllPagerbleDto,
  ) => Promise<{
    liketList: LiketEntity[];
    count: number;
  }> = async (userIdx, pagerble) => {
    const [liketList, count] = await this.prisma.$transaction([
      this.prisma.liket.findMany({
        include: {
          Review: {
            include: {
              CultureContent: {
                include: {
                  Genre: true,
                  Location: true,
                  ContentImg: {
                    where: {
                      deletedAt: null,
                    },
                    orderBy: {
                      idx: 'asc',
                    },
                  },
                },
              },
              ReviewImg: {
                where: {
                  deletedAt: null,
                },
                orderBy: {
                  idx: 'asc',
                },
              },
            },
          },
          User: true,
        },
        where: {
          userIdx,
          Review: {
            deletedAt: null,
          },
          deletedAt: null,
        },
        orderBy: {
          idx: 'desc',
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
      this.prisma.liket.count({
        where: {
          userIdx,
          Review: {
            deletedAt: null,
          },
          deletedAt: null,
        },
      }),
    ]);

    return {
      liketList: liketList.map((liket) => LiketEntity.createEntity(liket)),
      count,
    };
  };
}
