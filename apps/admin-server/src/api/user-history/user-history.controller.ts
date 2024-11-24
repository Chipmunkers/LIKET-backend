import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserHistoryService } from './user-history.service';
import { GetReviewAllPagerbleDto } from './dto/request/get-review-all-pagerble.dto';
import { LoginAuth } from '../auth/login-auth.decorator';
import { GetReviewAllResponseDto } from './dto/response/get-review-all-response.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user-history')
export class UserHistoryController {
  constructor(private readonly userHistoryService: UserHistoryService) {}

  /**
   * 사용자의 리뷰 목록 보기
   */
  @Get('/:idx/review/all')
  @ApiTags('User')
  @LoginAuth()
  async getUserReviewAll(
    @Param('idx', ParseIntPipe) userIdx: number,
    @Query() pagerbleDto: GetReviewAllPagerbleDto,
  ): Promise<GetReviewAllResponseDto> {
    return await this.userHistoryService.getReviewByUserIdx(
      userIdx,
      pagerbleDto,
    );
  }
}
