import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { ReviewListPagerbleDto } from './dto/ReviewListPagerbleDto';
import { GetReviewAllForAdminResponseDto } from './dto/response/GetReviewAllForAdminResponseDto';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * Get review all API
   * @summary Get review all API
   *
   * @tag Review
   */
  @Get('/all')
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No admin authorization')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getReviewAllForAdmin(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: ReviewListPagerbleDto,
  ): Promise<GetReviewAllForAdminResponseDto> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    return await this.reviewService.getReviewAllForAdmin(pagerble);
  }
}
