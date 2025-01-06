import { Injectable } from '@nestjs/common';
import { Prisma as PrismaType } from '@prisma/client';
import { ReportedReviewNotFoundException } from './exception/ReportedReviewNotFoundException';
import { ReportedReviewEntity } from './entity/reported-review.entity';
import { ReportedReviewPageableDto } from './dto/request/reported-review-pageable.dto';
import { SummaryReportedReviewEntity } from './entity/summary-reported-review.entity';
import { ReviewNotFoundException } from '../review/exception/ReviewNotFoundException';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class ReviewReportService {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * 신고된 리뷰 목록 보기
   *
   * @author jochongs
   *
   * @param pageable 쿼리스트링
   */
  public async getReportedReviewAll(pageable: ReportedReviewPageableDto) {
    const where: PrismaType.ReviewWhereInput = {
      reportCount: {
        not: 0,
      },
      // 리뷰 내용으로 검색
      description:
        pageable.searchby === 'review'
          ? {
              contains: pageable.search,
            }
          : undefined,
      // 사용자로 검색
      User:
        pageable.searchby === 'author'
          ? {
              email: {
                contains: pageable.search,
              },
            }
          : undefined,
      // state 필터링
      deletedAt:
        pageable.state === 'complete'
          ? {
              not: null,
            }
          : pageable.state === 'wait'
          ? null
          : undefined,
    };
    const reviewList = await this.prisma.review.findMany({
      include: {
        CultureContent: true,
        ReviewImg: {
          where: {
            deletedAt: null,
          },
        },
        User: true,
      },
      where,
      orderBy: {
        firstReportedAt: pageable.order,
      },
      take: 10,
      skip: (pageable.page - 1) * 10,
    });

    const count = await this.prisma.review.count({
      where,
    });

    return {
      reviewList: reviewList.map((review) =>
        SummaryReportedReviewEntity.createEntity(review),
      ),
      count,
    };
  }

  /**
   * 신고된 리뷰 자세히보기
   *
   * @author jochongs
   *
   * @param idx 리뷰 인덱스
   */
  public async getReportedReviewByIdx(idx: number) {
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
      },
    });

    if (!review) {
      throw new ReportedReviewNotFoundException('Cannot find review');
    }

    const typeList = await this.prisma.reviewReportType.findMany({
      select: {
        _count: {
          select: {
            ReviewReport: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
        idx: true,
        name: true,
      },
    });

    return ReportedReviewEntity.createEntity(review, typeList);
  }

  /**
   * 리뷰 신고 취소하기
   *
   * @author jochongs
   *
   * @param idx 리뷰 인덱스
   */
  public async cancelReportByIdx(idx: number) {
    const review = await this.prisma.review.findUnique({
      where: {
        idx,
      },
    });

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    await this.prisma.$transaction(async (tx) => {
      // 리뷰 신고 누적 수 0으로 변경
      await tx.review.update({
        where: {
          idx,
        },
        data: {
          reportCount: 0,
          firstReportedAt: null,
        },
      });

      // 사용자 신고 누적 수 감소
      await tx.user.update({
        where: {
          idx: review.userIdx,
        },
        data: {
          reportCount: {
            decrement: review.reportCount,
          },
        },
      });

      // 신고 전부 삭제 처리
      await tx.reviewReport.updateMany({
        where: {
          reviewIdx: idx,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    });
  }
}
