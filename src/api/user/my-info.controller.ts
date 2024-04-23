import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { CultureContentService } from '../culture-content/culture-content.service';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { ContentListByUserIdxPagerbleDto } from './dto/ContentListByUserIdxPagerbleDto';
import { GetMyContentAllResponseDto } from './dto/response/GetMyContentAllReseponseDto';
import { ReviewListByUserPagerbleDto } from '../review/dto/ReviewListByUserPagerbleDto';
import { GetMyReviewAllResponseDto } from './dto/response/GetMyReviewAllResponseDto';
import { ReviewService } from '../review/review.service';
import { GetMyLiketPagerbleDto } from './dto/GetMyLiketPagerbleDto';
import { LiketService } from '../liket/liket.service';
import { GetMyLiketAllResponseDto } from './dto/response/GetMyLiketAllReseponseDto';

@Controller('/my-info')
export class MyInfoController {
  constructor(
    private readonly contentService: CultureContentService,
    private readonly reviewService: ReviewService,
    private readonly liketService: LiketService,
  ) {}

  /**
   * Get all my culture-content requests API
   * @summary Get all my culture-content requests API
   *
   * @tag My-Info
   */
  @Get('/culture-content/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended denied')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getMyAllContentRequest(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: ContentListByUserIdxPagerbleDto,
  ): Promise<GetMyContentAllResponseDto> {
    return await this.contentService.getContentByUserIdx(
      loginUser.idx,
      pagerble,
    );
  }

  /**
   * Get all my review API
   * @summary Get all my review API
   *
   * @tag My-Info
   */
  @Get('/review/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended denied')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getMyReview(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: ReviewListByUserPagerbleDto,
  ): Promise<GetMyReviewAllResponseDto> {
    return await this.reviewService.getReviewAllByUserIdx(
      loginUser.idx,
      pagerble,
    );
  }

  /**
   * Get all my liket API
   * @summary Get all my liket API
   *
   * @tag My-Info
   */
  @Get('/liket/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended denied')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
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
