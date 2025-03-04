import { Injectable } from '@nestjs/common';
import { ReviewPageableDto } from './dto/review-pageable.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ContentNotFoundException } from '../culture-content/exception/ContentNotFound';
import { AlreadyLikeReviewException } from './exception/AlreadyLikeReviewException';
import { AlreadyNotLikeReviewException } from './exception/AlreadyNotLikeReviewException';
import { ReviewEntity } from './entity/review.entity';
import { LoginUser } from '../auth/model/login-user';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { ReviewNotFoundException } from './exception/ReviewNotFoundException';
import { ReviewRepository } from './review.repository';
import { ReviewLikeRepository } from './review-like.repository';
import { CultureContentRepository } from '../culture-content/culture-content.repository';
import { ReviewWithInclude } from './entity/prisma-type/review-with-include';
import { ReviewAuthService } from 'apps/user-server/src/api/review/review-auth.service';
import { ReviewCoreService } from 'libs/core/review/review-core.service';
import { CultureContentCoreService } from 'libs/core/culture-content/culture-content-core.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly cultureContentCoreService: CultureContentCoreService,
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewLikeRepository: ReviewLikeRepository,
    private readonly cultureContentRepository: CultureContentRepository,
    private readonly reviewAuthService: ReviewAuthService,
    private readonly reviewCoreService: ReviewCoreService,
    @Logger(ReviewService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 리뷰 목록 보기
   *
   * @author jochongs
   */
  public async getReviewAll(
    pageable: ReviewPageableDto,
    loginUser?: LoginUser,
  ): Promise<{
    reviewList: ReviewEntity[];
  }> {
    await this.reviewAuthService.checkReadAllPermission(pageable, loginUser);

    const reviewList: ReviewEntity[] = [];

    if (pageable.review && pageable.page === 1) {
      const firstReview = await this.reviewCoreService.findReviewByIdx(
        pageable.review,
        loginUser?.idx,
      );

      if (firstReview) {
        reviewList.push(ReviewEntity.fromModel(firstReview));
      }
    }

    reviewList.push(
      ...(
        await this.reviewCoreService.findReviewAll(
          {
            page: pageable.page,
            row: 10,
            cultureContentIdx: pageable.content,
            order: pageable.order,
            orderBy: pageable.orderby,
            isLiketCreated: pageable.liket,
            withOutReviewList: pageable.review ? [pageable.review] : [],
            userIdx: pageable.user,
          },
          loginUser?.idx,
        )
      ).map(ReviewEntity.fromModel),
    );

    return { reviewList };
  }

  /**
   * 리뷰 자세히보기
   */
  public async getReviewByIdx(
    idx: number,
    loginUser?: LoginUser,
  ): Promise<ReviewEntity> {
    const review = await this.reviewCoreService.findReviewByIdx(
      idx,
      loginUser?.idx,
    );

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    return ReviewEntity.fromModel(review);
  }

  /**
   * 인기 리뷰 가져오기
   */
  public async getHotReviewAll(loginUser?: LoginUser): Promise<ReviewEntity[]> {
    const reviewList = await this.reviewCoreService.findReviewAll(
      {
        page: 1,
        row: 5,
        from: 7,
        order: 'desc',
        orderBy: 'like',
        isOnlyAcceptedCultureContent: true,
        isOnlyOpenCultureContent: true,
      },
      loginUser?.idx,
    );

    return reviewList.map((review) => ReviewEntity.fromModel(review));
  }

  /**
   * 리뷰 생성하기
   */
  public async createReview(
    contentIdx: number,
    loginUser: LoginUser,
    createDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    const content =
      await this.cultureContentRepository.selectCultureContentByIdx(contentIdx);

    if (!content) {
      throw new ContentNotFoundException('Cannot find content');
    }

    if (!content.acceptedAt) {
      throw new ContentNotFoundException('Cannot find content');
    }

    const createdReviewModel = await this.reviewCoreService.createReview(
      {
        starRating: createDto.starRating,
        imgList: createDto.imgList,
        description: createDto.description,
        visitTime: createDto.visitTime,
      },
      loginUser.idx,
      contentIdx,
    );

    return ReviewEntity.fromModel(createdReviewModel);
  }

  /**
   * 리뷰 수정하기
   */
  public async updateReview(
    idx: number,
    updateDto: UpdateReviewDto,
  ): Promise<void> {
    await this.reviewRepository.updateReviewByIdx(idx, updateDto);
  }

  /**
   * 리뷰 삭제하기
   */
  public async deleteReview(idx: number): Promise<void> {
    await this.reviewRepository.deleteReviewByIdx(idx);
  }

  /**
   * 리뷰 좋아요 누르기
   */
  public async likeReview(userIdx: number, reviewIdx: number): Promise<void> {
    await this.getReviewByIdx(reviewIdx);

    const reviewLike = await this.reviewLikeRepository.selectReviewLike(
      userIdx,
      reviewIdx,
    );

    if (reviewLike) {
      this.logger.warn(this.likeReview, 'Attempt to like already liked review');
      throw new AlreadyLikeReviewException('Already like review');
    }

    await this.reviewLikeRepository.increaseReviewLike(userIdx, reviewIdx);

    return;
  }

  /**
   * 좋아요 취소하기
   */
  public async cancelToLikeReview(
    userIdx: number,
    reviewIdx: number,
  ): Promise<void> {
    await this.getReviewByIdx(reviewIdx);

    const reviewLike = await this.reviewLikeRepository.selectReviewLike(
      userIdx,
      reviewIdx,
    );

    if (!reviewLike) {
      this.logger.log(
        this.cancelToLikeReview,
        `Attempt to cancel to like non liked review ${reviewIdx}`,
      );
      throw new AlreadyNotLikeReviewException('Already do not like review');
    }

    await this.reviewLikeRepository.decreaseReviewLike(userIdx, reviewIdx);

    return;
  }
}
