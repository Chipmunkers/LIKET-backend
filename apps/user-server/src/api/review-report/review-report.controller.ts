import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { User } from '../user/user.decorator';
import { LoginUser } from '../auth/model/login-user';
import { ReviewReportService } from './review-report.service';
import { Exception } from '../../common/decorator/exception.decorator';
import { ReportReviewDto } from './dto/report-review.dto';
import { ReviewReportAuthService } from './review-report-auth.service';

@Controller()
@ApiTags('Review-Report')
export class ReviewReportController {
  constructor(
    private readonly reviewReportService: ReviewReportService,
    private readonly reviewReportAuthService: ReviewReportAuthService,
  ) {}

  /**
   * 리뷰 신고하기
   *
   * @author jochongs
   */
  @Post('/review/:idx/report')
  @HttpCode(201)
  @Exception(400, 'Invalid idx')
  @Exception(403, 'Permission Denied (report the review of login user)')
  @Exception(404, 'Cannot find review with idx')
  @Exception(409, 'Already reported review by login user')
  @LoginAuth()
  async reportReviewByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() reportReviewDto: ReportReviewDto,
    @User() loginUser: LoginUser,
  ): Promise<void> {
    await this.reviewReportAuthService.checkWritePermission(
      idx,
      reportReviewDto,
      loginUser,
    );

    await this.reviewReportService.reportReviewByIdx(
      idx,
      reportReviewDto,
      loginUser,
    );
  }
}
