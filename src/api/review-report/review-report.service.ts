import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { ReviewRepository } from '../review/review.repository';
import { ReviewReportRepository } from './review-report.repository';
import { LoginUser } from '../auth/model/login-user';
import { ReportReviewDto } from './dto/report-review.dto';
import { ReviewNotFoundException } from '../review/exception/ReviewNotFoundException';
import { AlreadyReportedReviewException } from './exception/AlreadyReportedReviewException';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class ReviewReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly reviewReportRepository: ReviewReportRepository,
    @Logger(ReviewReportService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 리뷰 신고하기, 신고할 경우 신고된
   *
   * @author jochongs
   *
   * @param idx 리뷰 인덱스
   */
  public async reportReviewByIdx(
    idx: number,
    reportReviewDto: ReportReviewDto,
    loginUser: LoginUser,
  ): Promise<void> {
    const review = await this.reviewRepository.selectReviewByIdx(idx);

    if (!review) {
      this.logger.warn(
        this.reportReviewByIdx,
        `Cannot find review | idx = ${idx}`,
      );
      throw new ReviewNotFoundException('Cannot find review');
    }

    const reviewReport = await this.reviewReportRepository.selectReviewReport(
      loginUser.idx,
      review.idx,
    );

    if (reviewReport) {
      this.logger.warn(
        this.reportReviewByIdx,
        `Login User(${loginUser.idx}) already report the review`,
      );
      throw new AlreadyReportedReviewException(
        'LoginUser already report the review',
      );
    }
    return await this.prisma.$transaction(async (tx) => {
      // 리뷰 신고 내역 생성
      await this.reviewReportRepository.insertReportReview(
        loginUser.idx,
        review.idx,
        reportReviewDto.typeIdx,
        tx,
      );

      // 리뷰 신고 횟수 1 증가
      await this.reviewRepository.increaseReviewCountByIdx(review.idx);

      // 사용자 신고 횟수 1 증가
      await this.userRepository.increaseReportCountByIdx(review.userIdx);
    });
  }
}
