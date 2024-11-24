import { Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewReportService } from './review-report.service';
import { GetReportedReviewResponseDto } from './dto/response/get-reported-review-response.dto';
import { LoginAuth } from '../auth/login-auth.decorator';
import { ReportedReviewPageableDto } from './dto/request/reported-review-pageable.dto';
import { ReportedReviewEntity } from './entity/reported-review.entity';

@Controller()
@ApiTags('Review-Report')
export class ReviewReportController {
  constructor(private readonly reviewReportService: ReviewReportService) {}

  /**
   * 신고 리뷰 목록 보기
   */
  @Get('/reported-review/all')
  @ApiResponse({ status: 400, description: 'Invalid querystring' })
  @LoginAuth()
  public async getReportedReviewAll(
    @Query() pageable: ReportedReviewPageableDto,
  ): Promise<GetReportedReviewResponseDto> {
    return await this.reviewReportService.getReportedReviewAll(pageable);
  }

  /**
   * 신고 리뷰 자세히보기
   */
  @Get('/reported-review/:idx')
  @ApiResponse({ status: 404, description: 'Cannot find review' })
  @LoginAuth()
  public async getReportedReviewByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<ReportedReviewEntity> {
    return await this.reviewReportService.getReportedReviewByIdx(idx);
  }

  /**
   * 신고 삭제 처리 하기
   */
  @Post('/reported-review/:idx/cancel')
  @ApiResponse({ status: 404, description: 'Cannot find review' })
  @LoginAuth()
  public async cancelReportByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    return await this.reviewReportService.cancelReportByIdx(idx);
  }
}
