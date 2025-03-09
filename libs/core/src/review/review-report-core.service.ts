import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { ReviewReportType } from 'libs/core/review/constant/review-report-type';
import { AlreadyReportedReviewException } from 'libs/core/review/exception/AlreadyReportedReviewException';
import { ReviewReportCoreRepository } from 'libs/core/review/review-report-core.repository';

@Injectable()
export class ReviewReportCoreService {
  constructor(
    private readonly reviewReportCoreRepository: ReviewReportCoreRepository,
  ) {}

  /**
   * 리뷰 신고하기
   *
   * @author jochongs
   *
   * @param reviewIdx 신고할 리뷰 인덱스
   * @param userIdx 신고한 사용자 인덱스
   * @param type 신고할 유형
   *
   * @throws {AlreadyReportedReviewException} 409 - 이미 신고한 리뷰일 경우
   */
  @Transactional()
  public async reportReviewByIdx(
    reviewIdx: number,
    userIdx: number,
    typeIdx: ReviewReportType,
  ): Promise<void> {
    const reviewState =
      await this.reviewReportCoreRepository.selectReviewReportStateByIdx(
        reviewIdx,
        userIdx,
      );

    if (reviewState) {
      throw new AlreadyReportedReviewException();
    }

    await this.reviewReportCoreRepository.insertReviewReport(
      reviewIdx,
      userIdx,
      typeIdx,
    );
    await this.reviewReportCoreRepository.increaseReviewReportCount(
      reviewIdx,
      1,
    );
  }
}
