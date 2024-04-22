import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { UpdateReviewDto } from './dto/UpdateReviewDto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * Update review by idx API
   * @summary Update review by idx API
   *
   * @tag Review
   */
  @Put('/:idx')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid path or body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(404, 'Cannot find review')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async updateReview(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) reviewIdx: number,
    @Body() updateDto: UpdateReviewDto,
  ): Promise<void> {
    const review = await this.reviewService.getReviewByIdx(
      reviewIdx,
      loginUser.idx,
    );

    if (review.author.idx !== loginUser.idx) {
      throw new ForbiddenException('Permission denied');
    }

    await this.reviewService.updateReview(reviewIdx, updateDto);

    return;
  }

  /**
   * Delete review by idx API
   * @summary Delete Review by idx API
   *
   * @tag Review
   */
  @Delete('/:idx')
  @TypedException<ExceptionDto>(400, 'Invalid path or body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(404, 'Cannot find review')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async deleteReview(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    const review = await this.reviewService.getReviewByIdx(
      reviewIdx,
      loginUser.idx,
    );

    if (review.author.idx !== loginUser.idx) {
      throw new ForbiddenException('Permission denied');
    }

    await this.reviewService.deleteReview(reviewIdx);

    return;
  }

  /**
   * Like review API
   * @summary Like review API
   *
   * @tag Review
   */
  @Post('/:idx/like')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(404, 'Cannot find review')
  @TypedException<ExceptionDto>(409, 'Already like review')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async likeReview(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    await this.reviewService.likeReview(loginUser.idx, reviewIdx);

    return;
  }

  /**
   * Cancel to like review API
   * @summary Cancel to like review API
   *
   * @tag Review
   */
  @Delete('/:idx/like')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(404, 'Cannot find review')
  @TypedException<ExceptionDto>(409, 'Already like review')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async cancelToLikeReview(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    await this.reviewService.cancelToLikeReview(loginUser.idx, reviewIdx);

    return;
  }
}
