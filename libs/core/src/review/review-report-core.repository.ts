import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { Injectable } from '@nestjs/common';
import { ReviewReport } from '@prisma/client';
import { ReviewReportType } from 'libs/core/review/constant/review-report-type';
import { ReportedReviewSelectField } from 'libs/core/review/model/prisma/reported-review-select-field';
import { ReviewReportTypeAggSelectField } from 'libs/core/review/model/prisma/review-report-type-agg-select-field';
import { FindReportedReviewAllInput } from 'libs/core/review/input/find-reported-review-all.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewReportCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT review_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 리뷰 식별자
   */
  public async selectReportedReviewByIdx(
    idx: number,
  ): Promise<ReportedReviewSelectField | null> {
    return await this.txHost.tx.review.findUnique({
      select: {
        idx: true,
        description: true,
        reportCount: true,
        likeCount: true,
        createdAt: true,
        starRating: true,
        visitTime: true,
        deletedAt: true,
        firstReportedAt: true,
        User: {
          select: {
            idx: true,
            profileImgPath: true,
            isAdmin: true,
            nickname: true,
            provider: true,
          },
        },
        ReviewImg: {
          select: {
            idx: true,
            imgPath: true,
            createdAt: true,
          },
          where: { deletedAt: null },
          orderBy: { idx: 'asc' },
        },
        CultureContent: {
          select: {
            idx: true,
            title: true,
            likeCount: true,
            User: {
              select: {
                idx: true,
                nickname: true,
                email: true,
                profileImgPath: true,
                isAdmin: true,
              },
            },
            ContentImg: {
              select: {
                idx: true,
                imgPath: true,
                createdAt: true,
              },
              where: { deletedAt: null },
              orderBy: { idx: 'asc' },
            },
            Genre: {
              select: {
                idx: true,
                name: true,
                createdAt: true,
              },
            },
          },
        },
      },
      where: { idx },
    });
  }

  /**
   * SELECT review_tb
   *
   * @author jochongs
   */
  public async selectReportedReviewAll({
    page,
    row,
    searchBy = [],
    search,
    state,
    orderBy = 'firstReportedAt',
    order = 'desc',
  }: FindReportedReviewAllInput): Promise<ReportedReviewSelectField[]> {
    return await this.txHost.tx.review.findMany({
      select: {
        idx: true,
        description: true,
        reportCount: true,
        likeCount: true,
        createdAt: true,
        starRating: true,
        visitTime: true,
        deletedAt: true,
        firstReportedAt: true,
        User: {
          select: {
            idx: true,
            profileImgPath: true,
            isAdmin: true,
            nickname: true,
            provider: true,
          },
        },
        ReviewImg: {
          select: {
            idx: true,
            imgPath: true,
            createdAt: true,
          },
          where: { deletedAt: null },
          orderBy: { idx: 'asc' },
        },
        CultureContent: {
          select: {
            idx: true,
            title: true,
            likeCount: true,
            User: {
              select: {
                idx: true,
                nickname: true,
                email: true,
                profileImgPath: true,
                isAdmin: true,
              },
            },
            ContentImg: {
              select: {
                idx: true,
                imgPath: true,
                createdAt: true,
              },
              where: { deletedAt: null },
              orderBy: { idx: 'asc' },
            },
            Genre: {
              select: {
                idx: true,
                name: true,
                createdAt: true,
              },
            },
          },
        },
      },
      where: {
        AND: [
          this.getReportStateWhereClause(state),
          this.getSearchWhereClause(searchBy, search),
        ],
      },
      orderBy: { [this.getOrderByField(orderBy)]: order },
      skip: (page - 1) * row,
      take: row,
    });
  }

  /**
   * 정렬 요소 필드 이름을 가져오는 메서드
   *
   * @author jochongs
   */
  private getOrderByField(
    orderBy: FindReportedReviewAllInput['orderBy'],
  ): 'firstReportedAt' | 'reportCount' | 'idx' {
    if (orderBy === 'firstReportedAt') {
      return 'firstReportedAt';
    }
    if (orderBy === 'reportCount') {
      return 'reportCount';
    }
    return 'idx';
  }

  /**
   * 신고 상태 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  public getReportStateWhereClause(
    state: FindReportedReviewAllInput['state'],
  ): Prisma.ReviewWhereInput {
    if (!state) return {};

    return {
      deletedAt: state ? { not: null } : null,
    };
  }

  /**
   * 검색어 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  public getSearchWhereClause(
    searchBy: FindReportedReviewAllInput['searchBy'],
    search: FindReportedReviewAllInput['search'],
  ): Prisma.ReviewWhereInput {
    if (!search || !searchBy || !searchBy.length) return {};

    return {
      description: searchBy.includes('review')
        ? { contains: search }
        : undefined,
      User: searchBy.includes('author')
        ? { email: { contains: search }, nickname: { contains: search } }
        : undefined,
    };
  }

  /**
   * SELECT review_report_tb WHERE review_idx = $1 GROUP BY type_idx
   */
  public async selectReportCountGroupByTypeIdx(
    idx: number,
  ): Promise<ReviewReportTypeAggSelectField[]> {
    return await this.txHost.tx.reviewReportType.findMany({
      select: {
        idx: true,
        name: true,
        _count: {
          select: {
            ReviewReport: true,
          },
        },
      },
      where: {
        ReviewReport: {
          some: {
            reviewIdx: idx,
            deletedAt: null,
          },
        },
      },
    });
  }

  /**
   * SELECT review_report_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param reviewIdx 리뷰 식별자
   * @param userIdx 사용자 식별자
   */
  public async selectReviewReportStateByIdx(
    reviewIdx: number,
    userIdx: number,
  ): Promise<ReviewReport | null> {
    return await this.txHost.tx.reviewReport.findUnique({
      where: {
        reportUserIdx_reviewIdx: {
          reportUserIdx: userIdx,
          reviewIdx,
        },
      },
    });
  }

  /**
   * INSERT review_report_tb
   *
   * @author jochongs
   *
   * @param reviewIdx 리뷰 식별자
   * @param userIdx 사용자 식별자
   */
  public async insertReviewReport(
    reviewIdx: number,
    userIdx: number,
    typeIdx: ReviewReportType,
  ): Promise<ReviewReport> {
    return await this.txHost.tx.reviewReport.create({
      data: {
        reviewIdx,
        reportUserIdx: userIdx,
        typeIdx,
      },
    });
  }

  /**
   * Soft DELETE review_report_tb WHERE review_idx = $1 AND report_user_idx = $2
   *
   * @author jochongs
   *
   * @param reviewIdx 리뷰 식별자
   */
  public async softDeleteReviewReportAllByIdx(
    reviewIdx: number,
  ): Promise<void> {
    await this.txHost.tx.reviewReport.updateMany({
      where: { reviewIdx, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * UPDATE review_tb SET report_count = report_count + $2 WHERE idx = $1
   *
   * @author jochongs
   *
   * @param reviewIdx 리뷰 식별자
   * @param count 증가 시킬 신고 횟수
   */
  public async increaseReviewReportCount(
    reviewIdx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.review.update({
      where: { idx: reviewIdx, deletedAt: null },
      data: {
        reportCount: {
          increment: count,
        },
      },
    });
  }

  /**
   * UPDATE review_tb SET report_count = 0
   *
   * @author jochongs
   *
   * @param reviewIdx 리뷰 식별자
   */
  public async updateReviewReportCountToZero(reviewIdx: number): Promise<void> {
    await this.txHost.tx.review.update({
      where: { idx: reviewIdx, deletedAt: null },
      data: { reportCount: 0 },
    });
  }
}
