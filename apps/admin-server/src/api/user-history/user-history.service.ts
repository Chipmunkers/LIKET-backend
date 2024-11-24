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
}
