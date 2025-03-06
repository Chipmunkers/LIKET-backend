import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { Injectable } from '@nestjs/common';
import { ReviewReport } from '@prisma/client';

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
}
