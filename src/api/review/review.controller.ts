import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { Exception } from '../../common/decorator/exception.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewByContentPagerbleDto } from './dto/get-review-by-content-pagerble.dto';
import { GetReviewAllResponseDto } from './dto/response/get-review-all-response.dto';

@Controller()
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * 리뷰 생성하기
   */
  @Post('/culture-content/:idx/review')
  @HttpCode(201)
  @Exception(400, 'Invalid path or body')
  @Exception(404, 'Cannot find culture-content')
  @LoginAuth()
  public async createReview(
    @User() loginUser: LoginUserDto,
    @Body() createDto: CreateReviewDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    await this.reviewService.createReview(contentIdx, loginUser.idx, createDto);

    return;
  }

  /**
   * 컨텐츠 리뷰 목록 보기
   */
  @Get('/culture-content/:idx/review/all')
  @HttpCode(200)
  @Exception(400, 'Invalid querystring')
  @Exception(404, 'Cannot find culture-content')
  @LoginAuth()
  public async getReviewAll(
    @Param('idx', ParseIntPipe) contentIdx: number,
    @User() loginUser: LoginUserDto,
    @Query() pagerble: GetReviewByContentPagerbleDto,
  ): Promise<GetReviewAllResponseDto> {
    return await this.reviewService.getReviewAll(
      contentIdx,
      loginUser.idx,
      pagerble,
    );
  }

  /**
   * 리뷰 수정하기
   */
  @Put('/review/:idx')
  @HttpCode(201)
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
  @Delete('/review/:idx')
  @HttpCode(201)
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
  @Post('/review/:idx/like')
  @HttpCode(201)
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
  @Delete('/review/:idx/like')
  @HttpCode(201)
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
