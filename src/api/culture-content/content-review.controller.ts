import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from '../review/review.service';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewByContentPagerbleDto } from './dto/get-review-by-content-pagerble.dto';
import { CultureContentService } from './culture-content.service';
import { GetReviewAllResponseDto } from './dto/response/get-review-all-response.dto';
import { Exception } from '../../common/decorator/exception.decorator';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';

@Controller('culture-content')
export class ContentReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly cultureContentService: CultureContentService,
  ) {}

  /**
   * 리뷰 생성하기
   */
  @Post(':idx/review')
  @HttpCode(201)
  @ApiTags('Culture-Content')
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
  @Get(':idx/review/all')
  @HttpCode(200)
  @ApiTags('Culture-Content')
  @Exception(400, 'Invalid querystring')
  @Exception(404, 'Cannot find culture-content')
  @LoginAuth()
  public async getReviewAll(
    @Param('idx', ParseIntPipe) contentIdx: number,
    @User() loginUser: LoginUserDto,
    @Query() pagerble: GetReviewByContentPagerbleDto,
  ): Promise<GetReviewAllResponseDto> {
    await this.cultureContentService.getContentByIdx(contentIdx, loginUser.idx);

    return await this.reviewService.getReviewAll(
      contentIdx,
      loginUser.idx,
      pagerble,
    );
  }
}
