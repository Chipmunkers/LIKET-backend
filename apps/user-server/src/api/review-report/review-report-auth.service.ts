import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../review/review.repository';
import { ReportReviewDto } from './dto/report-review.dto';
import { LoginUser } from '../auth/model/login-user';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';

@Injectable()
export class ReviewReportAuthService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  /**
   * @author jochongs
   */
  public async checkWritePermission(
    idx: number,
    reportDto: ReportReviewDto,
    loginUser: LoginUser,
  ): Promise<void> {
    const review = await this.reviewRepository.selectReviewByIdx(idx);

    // 리뷰 존재여부는 reviewReportService에서 확인, 로직상 어쩔 수 없음
    if (review?.userIdx === loginUser.idx) {
      throw new PermissionDeniedException('Permission Denied');
    }
  }
}
