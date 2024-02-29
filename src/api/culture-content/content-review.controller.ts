import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from '../review/review.service';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { ReviewListByContentPagerbleDto } from './dto/ReviewListByContentPagerbleDto';
import { CultureContentService } from './culture-content.service';
import { GetReviewAllResponseDto } from './dto/response/GetReviewAllResponseDto';

@Controller('culture-content')
export class ContentReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly cultureContentService: CultureContentService,
  ) {}

  /**
   * Create review API
   * @summary Create review APi
   *
   * @tag Culture-Content
   */
  @Post(':idx/review')
  @TypedException<ExceptionDto>(400, 'Invalid path or body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(404, 'Cannot find culture-content')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async createReview(
    @User() loginUser: LoginUserDto,
    @Body() createDto: CreateReviewDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    await this.reviewService.createReview(contentIdx, loginUser.idx, createDto);

    return;
  }

  /**
   * Get review all API
   * @summary Get review all API
   *
   * @tag Culture-Content
   */
  @Get(':idx/review/all')
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(404, 'Cannot find culture-content')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getReviewAll(
    @Param('idx', ParseIntPipe) contentIdx: number,
    @User() loginUser: LoginUserDto,
    @Query() pagerble: ReviewListByContentPagerbleDto,
  ): Promise<GetReviewAllResponseDto> {
    await this.cultureContentService.getContentByIdx(contentIdx, loginUser.idx);

    return await this.reviewService.getReviewAll(
      contentIdx,
      loginUser.idx,
      pagerble,
    );
  }
}
