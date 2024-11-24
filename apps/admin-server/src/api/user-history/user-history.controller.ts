import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserHistoryService } from './user-history.service';
import { GetReviewAllPagerbleDto } from './dto/request/get-review-all-pagerble.dto';
import { LoginAuth } from '../auth/login-auth.decorator';
import { GetReviewAllResponseDto } from './dto/response/get-review-all-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetLiketAllResponseDto } from './dto/response/get-liket-all-response.dto';
import { GetLiketAllPagerbleDto } from './dto/request/get-liket-all-pagerble.dto';

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
    return await this.userHistoryService.getReviewByUserIdx(userIdx, pagerbleDto);
  }

  /**
   * 사용자 라이켓 목록 보기
   */
  @Get('/:idx/liket/all')
  @ApiTags('User')
  @LoginAuth()
  async getUserLiketAll(
    @Param('idx', ParseIntPipe) idx: number,
    @Query() pagerbleDto: GetLiketAllPagerbleDto,
  ): Promise<GetLiketAllResponseDto> {
    return await this.userHistoryService.getLiketByUserIdx(idx, pagerbleDto);
  }
}
