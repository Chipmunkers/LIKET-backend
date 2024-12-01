import { Injectable } from '@nestjs/common';
import { ReviewPagerbleDto } from './dto/review-pagerble.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ContentNotFoundException } from '../culture-content/exception/ContentNotFound';
import { AlreadyLikeReviewException } from './exception/AlreadyLikeReviewException';
import { AlreadyNotLikeReviewExcpetion } from './exception/AlreadyNotLikeReviewException';
import { ReviewEntity } from './entity/review.entity';
import { LoginUser } from '../auth/model/login-user';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { ReviewNotFoundException } from './exception/ReviewNotFoundException';
import { ReviewRepository } from './review.repository';
import { ReviewLikeRepository } from './review-like.repository';
import { CultureContentRepository } from '../culture-content/culture-content.repository';
import { ReviewWithInclude } from './entity/prisma-type/review-with-include';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewLikeRepository: ReviewLikeRepository,
    private readonly cultureContentRepository: CultureContentRepository,
    @Logger(ReviewService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 리뷰 목록 보기
   *
   * @author jochongs
   */
  public async getReviewAll(
    pagerble: ReviewPagerbleDto,
    userIdx?: number,
  ): Promise<{
    reviewList: ReviewEntity[];
  }> {
    const reviewList: ReviewWithInclude[] = [];
    if (pagerble.review && pagerble.page === 1) {
      const firstReview = await this.reviewRepository.selectReviewByIdx(
        pagerble.review,
        userIdx,
      );

      if (firstReview) {
        reviewList.push(firstReview);
      }
    }

    reviewList.push(
      ...(await this.reviewRepository.selectReviewAll(pagerble, userIdx)),
    );

    return {
      reviewList: reviewList.map((review) => ReviewEntity.createEntity(review)),
    };
  }

  /**
   * 리뷰 자세히보기
   */
  public async getReviewByIdx(idx: number, loginUser?: LoginUser) {
    const review = await this.reviewRepository.selectReviewByIdx(
      idx,
      loginUser?.idx,
    );

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    return ReviewEntity.createEntity(review);
  }

  /**
   * 인기 리뷰 가져오기
   */
  public async getHotReviewAll(loginUser?: LoginUser): Promise<ReviewEntity[]> {
    const reviewList = await this.reviewRepository.selectHotReviewAll(
      loginUser?.idx,
    );

    return reviewList.map((review) => ReviewEntity.createEntity(review));
  }

  /**
   * 리뷰 생성하기
   */
  public async createReview(
    contentIdx: number,
    userIdx: number,
    createDto: CreateReviewDto,
  ): Promise<void> {
    const content =
      await this.cultureContentRepository.selectCultureContentByIdx(contentIdx);

    if (!content) {
      this.logger.warn(
        this.createReview,
        `Attempt to create review with non-existent content ${contentIdx}`,
      );
      throw new ContentNotFoundException('Cannot find content');
    }

    if (!content.acceptedAt) {
      this.logger.warn(
        this.createReview,
        `Attempt to create review with not accepted content ${contentIdx}`,
      );
      throw new ContentNotFoundException('Cannot find content');
    }

    await this.reviewRepository.insertReview({
      userIdx,
      contentIdx: content.idx,
      starRating: createDto.starRating,
      description: createDto.description,
      imgList: createDto.imgList,
      visitTime: new Date(createDto.visitTime),
    });
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
      throw new AlreadyNotLikeReviewExcpetion('Already do not like review');
    }

    await this.reviewLikeRepository.decreaseReviewLike(userIdx, reviewIdx);

    return;
  }
}
