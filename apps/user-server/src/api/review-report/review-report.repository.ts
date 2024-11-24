import { Injectable } from '@nestjs/common';
import { Prisma, ReviewReport } from '@prisma/client';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class ReviewReportRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * 리뷰 신고 가져오기
   *
   * @author jochongs
   *
   * @param userIdx 신고한 사용자 인덱스
   * @param reviewIdx 신고당한 리뷰 인덱스
   */
  public selectReviewReport(
    userIdx: number,
    reviewIdx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<ReviewReport | null> {
    return (tx ?? this.prisma).reviewReport.findUnique({
      where: {
        reportUserIdx_reviewIdx: {
          reportUserIdx: userIdx,
          reviewIdx,
        },
      },
    });
  }

  /**
   * 리뷰 신고 삽입하기
   *
   * @author jochongs
   *
   * @param userIdx 신고할 사용자 인덱스
   * @param reviewIdx 리뷰 인덱스
   * @param typeIdx 리뷰 신고 유형 인덱스
   */
  public insertReportReview(
    userIdx: number,
    reviewIdx: number,
    typeIdx: number,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx ?? this.prisma).reviewReport.create({
      data: {
        reportUserIdx: userIdx,
        reviewIdx,
        typeIdx,
      },
    });
  }
}
