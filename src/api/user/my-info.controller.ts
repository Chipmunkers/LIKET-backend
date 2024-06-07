import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { CultureContentService } from '../culture-content/culture-content.service';
import { User } from './user.decorator';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { GetMyCultureContentPagerble } from './dto/get-my-content-all-pageble.dto';
import { GetMyContentAllResponseDto } from './dto/response/get-my-content-all-response.dto';
import { GetMyReviewAllResponseDto } from './dto/response/get-my-review-all-response.dto';
import { ReviewService } from '../review/review.service';
import { GetMyLiketPagerbleDto } from './dto/get-my-liket-all-pagerble.dto';
import { LiketService } from '../liket/liket.service';
import { GetMyLiketAllResponseDto } from './dto/response/get-my-liket-all-response.dto';
import { GetMyReviewAllPagerbleDto } from './dto/get-my-review-all-response.dto';
import { LoginAuth } from '../auth/login-auth.decorator';
import { Exception } from '../../common/decorator/exception.decorator';

@Controller('/my-info')
export class MyInfoController {
  constructor(
    private readonly contentService: CultureContentService,
    private readonly reviewService: ReviewService,
    private readonly liketService: LiketService,
  ) {}

  /**
   * Get all my culture-content requests API
   */
  @Get('/culture-content/all')
  @HttpCode(200)
  @Exception(400, 'Invalid querystring')
  @LoginAuth()
  public async getMyAllContentRequest(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: GetMyCultureContentPagerble,
  ): Promise<GetMyContentAllResponseDto> {
    return await this.contentService.getContentByUserIdx(
      loginUser.idx,
      pagerble,
    );
  }

  /**
   * Get all my review API
   */
  @Get('/review/all')
  @HttpCode(200)
  @Exception(400, 'Invalid querystring')
  @LoginAuth()
  public async getMyReview(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: GetMyReviewAllPagerbleDto,
  ): Promise<GetMyReviewAllResponseDto> {
    return await this.reviewService.getReviewAllByUserIdx(
      loginUser.idx,
      pagerble,
    );
  }

  /**
   * Get all my liket API
   */
  @Get('/liket/all')
  @HttpCode(200)
  @Exception(400, 'Invalid querystring')
  @LoginAuth()
  public async getMyLiket(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: GetMyLiketPagerbleDto,
  ): Promise<GetMyLiketAllResponseDto> {
    return {
      liketList: await this.liketService.getAllLiketByUserIdx(
        loginUser.idx,
        pagerble,
      ),
    };
  }
}
