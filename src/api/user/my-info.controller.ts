import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { CultureContentService } from '../culture-content/culture-content.service';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { ContentListByUserIdxPagerbleDto } from '../culture-content/dto/ContentListByUserIdxPagerbleDto';
import { GetMyContentAllResponseDto } from './dto/response/GetMyContentAllReseponseDto';
import { ReviewListByUserPagerbleDto } from '../review/dto/ReviewListByUserPagerbleDto';
import { GetMyReviewAllResponseDto } from './dto/response/GetMyReviewAllResponseDto';
import { ReviewService } from '../review/review.service';

@Controller('/my-info')
export class MyInfoController {
  constructor(
    private readonly contentService: CultureContentService,
    private readonly reviewService: ReviewService,
  ) {}

  /**
   * Get all my culture-content requests
   * @summary Get all my culture-content requests
   *
   * @tag My-Info
   */
  @Get('/culture-content')
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
   * Get all my review
   * @summary Get all my review
   *
   * @tag My-Info
   */
  @Get('/review')
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
}
