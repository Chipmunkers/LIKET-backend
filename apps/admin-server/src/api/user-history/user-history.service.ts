import { Injectable } from '@nestjs/common';
import { GetReviewAllPagerbleDto } from './dto/request/get-review-all-pagerble.dto';
import { ReviewEntity } from '../review/entity/review.entity';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class UserHistoryService {
  constructor(private readonly prisma: PrismaProvider) {}

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
