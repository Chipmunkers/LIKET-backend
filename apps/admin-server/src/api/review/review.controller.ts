import { Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { GetReviewAllPagerbleDto } from './dto/request/get-review-all-pagerble.dto';
import { GetReviewAllResponseDto } from './dto/response/get-review-all-response.dto';
import { GetReviewResponseDto } from './dto/response/get-review-response.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * 리뷰 목록 보기
   */
  @Get('/all')
  @HttpCode(200)
  @ApiTags('Review')
  @ApiResponse({ status: 400, description: 'Invalid querystring' })
  @LoginAuth()
  async getReviewAll(@Query() pagerble: GetReviewAllPagerbleDto): Promise<GetReviewAllResponseDto> {
    return await this.reviewService.getReviewAll(pagerble);
  }

  /**
   * 리뷰 자세히보기
   */
  @Get('/:idx')
  @HttpCode(200)
  @ApiTags('Review')
  @ApiResponse({ status: 404, description: 'Cannot find review' })
  @LoginAuth()
  async getReviewByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<GetReviewResponseDto> {
    const review = await this.reviewService.getReviewByIdx(idx);

    return { review };
  }

  /**
   * 리뷰 삭제하기
   */
  @Delete('/:idx')
  @HttpCode(201)
  @ApiTags('Review')
  @LoginAuth()
  async deleteReviewByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.reviewService.deleteReviewByIdx(idx);

    return;
  }
}
