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
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { Exception } from '../../common/decorator/exception.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * 리뷰 수정하기
   */
  @Put('/:idx')
  @HttpCode(201)
  @ApiTags('Review')
  @Exception(400, 'Invalid path or body')
  @Exception(404, 'Cannot find review')
  @LoginAuth()
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
   * 리뷰 삭제하기
   */
  @Delete('/:idx')
  @HttpCode(201)
  @ApiTags('Review')
  @Exception(400, 'Invalid path or body')
  @Exception(404, 'Cannot find review')
  @LoginAuth()
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
   * 리뷰 좋아요하기
   */
  @Post('/:idx/like')
  @HttpCode(201)
  @ApiTags('Review')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find review')
  @Exception(409, 'Already like review')
  @LoginAuth()
  public async likeReview(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    await this.reviewService.likeReview(loginUser.idx, reviewIdx);

    return;
  }

  /**
   * 리뷰 좋아요 취소하기
   */
  @Delete('/:idx/like')
  @HttpCode(201)
  @ApiTags('Review')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find review')
  @Exception(409, 'Already like review')
  @LoginAuth()
  public async cancelToLikeReview(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    await this.reviewService.cancelToLikeReview(loginUser.idx, reviewIdx);

    return;
  }
}
