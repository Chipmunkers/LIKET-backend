import { Injectable } from '@nestjs/common';
import { GetReviewAllPagerbleDto } from './dto/request/get-review-all-pagerble.dto';
import { ReviewEntity } from './entity/review.entity';
import { ReviewNotFoundException } from './exception/ReviewNotFoundException';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaProvider) {}

  getReviewAll: (pagerble: GetReviewAllPagerbleDto) => Promise<{
    reviewList: ReviewEntity[];
    count: number;
  }> = async (pagerble) => {
    const [reviewList, count] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        include: {
          CultureContent: true,
          ReviewImg: {
            where: {
              deletedAt: null,
            },
          },
          User: true,
        },
        where: {
          deletedAt: null,
          description:
            pagerble.searchby === 'description' ? pagerble.search : undefined,
          CultureContent: {
            title:
              pagerble.searchby === 'content'
                ? {
                    contains: pagerble.search || '',
                  }
                : undefined,
            deletedAt: null,
            User: {
              deletedAt: null,
            },
          },
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
          deletedAt: null,
          description:
            pagerble.searchby === 'description' ? pagerble.search : undefined,
          CultureContent: {
            title:
              pagerble.searchby === 'content'
                ? {
                    contains: pagerble.search || '',
                  }
                : undefined,
            deletedAt: null,
            User: {
              deletedAt: null,
            },
          },
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
      }),
    ]);

    return {
      reviewList: reviewList.map((review) => ReviewEntity.createEntity(review)),
      count,
    };
  };

  getReviewByIdx: (idx: number) => Promise<ReviewEntity> = async (idx) => {
    const review = await this.prisma.review.findUnique({
      include: {
        CultureContent: true,
        ReviewImg: {
          where: {
            deletedAt: null,
          },
        },
        User: true,
      },
      where: {
        idx,
        deletedAt: null,
        CultureContent: {
          deletedAt: null,
          User: {
            deletedAt: null,
          },
        },
        User: {
          deletedAt: null,
        },
      },
    });

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    return ReviewEntity.createEntity(review);
  };

  deleteReviewByIdx: (idx: number) => Promise<void> = async (idx) => {
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
}
