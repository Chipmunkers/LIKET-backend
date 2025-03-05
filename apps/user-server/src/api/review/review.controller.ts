import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { User } from '../user/user.decorator';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { Exception } from '../../common/decorator/exception.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewPageableDto } from './dto/review-pageable.dto';
import { GetReviewAllResponseDto } from './dto/response/get-review-all-response.dto';
import { ReviewAuthService } from './review-auth.service';
import { LoginUser } from '../auth/model/login-user';
import { ReviewEntity } from './entity/review.entity';

@Controller()
@ApiTags('Review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly reviewAuthService: ReviewAuthService,
  ) {}

  /**
   * 컨텐츠 리뷰 목록 보기
   *
   * @author jochongs
   */
  @Get('/review/all')
  @HttpCode(200)
  @Exception(400, 'Invalid querystring')
  @Exception(404, 'Cannot find culture-content')
  public async getReviewAll(
    @Query() pagerble: ReviewPageableDto,
    @User() loginUser?: LoginUser,
  ): Promise<GetReviewAllResponseDto> {
    return await this.reviewService.getReviewAll(pagerble, loginUser);
  }

  /**
   * 리뷰 자세히보기
   *
   * @author jochongs
   */
  @Get('/review/:idx')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find review')
  public async getReviewByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser?: LoginUser,
  ): Promise<ReviewEntity> {
    return await this.reviewService.getReviewByIdx(idx, loginUser);
  }

  /**
   * 최근 인기 리뷰 목록 보기
   *
   * @author jochongs
   */
  @Get('/review/hot/all')
  @HttpCode(200)
  public async getHotReviewAll(
    @User() loginUser?: LoginUser,
  ): Promise<ReviewEntity[]> {
    return await this.reviewService.getHotReviewAll(loginUser);
  }

  /**
   * 리뷰 생성하기
   *
   * @author jochongs
   */
  @Post('/culture-content/:idx/review')
  @HttpCode(201)
  @Exception(400, 'Invalid path or body')
  @Exception(404, 'Cannot find culture-content')
  @LoginAuth()
  public async createReview(
    @User() loginUser: LoginUser,
    @Body() createDto: CreateReviewDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<ReviewEntity> {
    return await this.reviewService.createReview(
      contentIdx,
      loginUser,
      createDto,
    );
  }

  /**
   * 리뷰 수정하기
   *
   * @author jochongs
   */
  @Put('/review/:idx')
  @HttpCode(201)
  @Exception(400, 'Invalid path or body')
  @Exception(404, 'Cannot find review')
  @LoginAuth()
  public async updateReview(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) reviewIdx: number,
    @Body() updateDto: UpdateReviewDto,
  ): Promise<void> {
    await this.reviewService.updateReview(reviewIdx, updateDto, loginUser);
  }

  /**
   * 리뷰 삭제하기
   *
   * @author jochongs
   */
  @Delete('/review/:idx')
  @HttpCode(201)
  @Exception(400, 'Invalid path or body')
  @Exception(404, 'Cannot find review')
  @LoginAuth()
  public async deleteReview(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    await this.reviewService.deleteReview(reviewIdx, loginUser);
  }

  /**
   * 리뷰 좋아요하기
   *
   * @author jochongs
   */
  @Post('/review/:idx/like')
  @HttpCode(201)
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find review')
  @Exception(409, 'Already like review')
  @LoginAuth()
  public async likeReview(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    await this.reviewService.likeReview(loginUser, reviewIdx);

    return;
  }

  /**
   * 리뷰 좋아요 취소하기
   *
   * @author jochongs
   */
  @Delete('/review/:idx/like')
  @HttpCode(201)
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find review')
  @Exception(409, 'Already like review')
  @LoginAuth()
  public async cancelToLikeReview(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) reviewIdx: number,
  ): Promise<void> {
    await this.reviewService.cancelToLikeReview(loginUser, reviewIdx);

    return;
  }
}
