import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { ReviewReportType } from 'libs/core/review/constant/review-report-type';
import { AlreadyReportedReviewException } from 'libs/core/review/exception/AlreadyReportedReviewException';
import { ReviewNotFoundException } from 'libs/core/review/exception/ReviewNotFoundException';
import { ReviewCoreRepository } from 'libs/core/review/review-core.repository';
import { ReviewReportCoreRepository } from 'libs/core/review/review-report-core.repository';
import { UserCoreRepository } from 'libs/core/user/user-core.repository';

@Injectable()
export class ReviewReportCoreService {
  constructor(
    private readonly reviewReportCoreRepository: ReviewReportCoreRepository,
    private readonly userCoreRepository: UserCoreRepository,
    private readonly reviewCoreRepository: ReviewCoreRepository,
  ) {}

  /**
   * 리뷰 신고하기
   * - 삭제된 리뷰는 더 이상 신고할 수 없습니다.
   *
   * @author jochongs
   *
   * @param reviewIdx 신고할 리뷰 인덱스
   * @param userIdx 신고한 사용자 인덱스
   * @param type 신고할 유형
   *
   * @throws {AlreadyReportedReviewException} 409 - 이미 신고한 리뷰일 경우
   * @throws {ReviewNotFoundException} 404 - 리뷰를 찾을 수 없을 경우
   */
  @Transactional()
  public async reportReviewByIdx(
    reviewIdx: number,
    userIdx: number,
    typeIdx: ReviewReportType,
  ): Promise<void> {
    const review = await this.reviewCoreRepository.selectReviewByIdx(
      reviewIdx,
      userIdx,
    );

    if (!review) {
      throw new ReviewNotFoundException(reviewIdx);
    }

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
    await this.userCoreRepository.increaseReportCountByIdx(review.User.idx, 1);
  }

  /**
   * 리뷰의 신고 내역 삭제하기
   *
   * @author jochongs
   *
   * @param reviewIdx 리뷰 인덱스
   *
   * @throws {ReviewNotFoundException} 404 - 리뷰를 찾을 수 없을 경우
   */
  @Transactional()
  public async deleteReviewReportAllByReviewIdx(reviewIdx: number) {
    const review =
      await this.reviewReportCoreRepository.selectReportedReviewByIdx(
        reviewIdx,
      );

    if (!review) {
      throw new ReviewNotFoundException(reviewIdx);
    }

    await this.reviewReportCoreRepository.softDeleteReviewReportAllByIdx(
      reviewIdx,
    );
    await this.reviewReportCoreRepository.updateReviewReportCountToZero(
      reviewIdx,
    );
    await this.userCoreRepository.decreaseReportCountByIdx(
      review.User.idx,
      review.reportCount,
    );
  }
}
