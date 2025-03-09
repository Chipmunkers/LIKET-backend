import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { Injectable } from '@nestjs/common';
import { ReviewReport } from '@prisma/client';
import { ReviewReportType } from 'libs/core/review/constant/review-report-type';

@Injectable()
export class ReviewReportCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

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
   * @param userIdx 사용자 식별자
   */
  public async softDeleteReviewReportState(
    reviewIdx: number,
    userIdx: number,
  ): Promise<void> {
    await this.txHost.tx.reviewReport.update({
      where: {
        reportUserIdx_reviewIdx: {
          reviewIdx,
          reportUserIdx: userIdx,
        },
      },
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
