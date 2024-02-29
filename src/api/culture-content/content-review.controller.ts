import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from '../review/review.service';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';

@Controller('culture-content')
export class ContentReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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
}
