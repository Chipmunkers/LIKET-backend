import { Injectable } from '@nestjs/common';
import { LoginUser } from '../auth/model/login-user';
import { ReportReviewDto } from './dto/report-review.dto';
import { ReviewReportCoreService } from 'libs/core/review/review-report-core.service';

@Injectable()
export class ReviewReportService {
  constructor(
    private readonly reviewReportCoreService: ReviewReportCoreService,
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
    await this.reviewReportCoreService.reportReviewByIdx(
      idx,
      loginUser.idx,
      reportReviewDto.typeIdx,
    );
  }
}
