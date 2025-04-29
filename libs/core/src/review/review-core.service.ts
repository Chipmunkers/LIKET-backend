import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { CreateReviewInput } from 'libs/core/review/input/create-review.input';
import { FindReviewAllInput } from 'libs/core/review/input/find-review-all.input';
import { UpdateReviewInput } from 'libs/core/review/input/update-review.input';
import { ReviewModel } from 'libs/core/review/model/review.model';
import { ReviewCoreRepository } from 'libs/core/review/review-core.repository';

@Injectable()
export class ReviewCoreService {
  constructor(private readonly reviewCoreRepository: ReviewCoreRepository) {}

  /**
   * 리뷰 목록을 불러오는 메서드
   *
   * @author jochongs
   *
   * @params input 검색 옵션
   * @param readUser 조회한 사용자 인덱스
   */
  @Transactional()
  public async findReviewAll(
    input: FindReviewAllInput,
    readUser?: number,
  ): Promise<ReviewModel[]> {
    return (
      await this.reviewCoreRepository.selectReviewAll(input, readUser)
    ).map(ReviewModel.fromPrisma);
  }

  /**
   * idx를 통해 문화생활컨텐츠를 탐색하는 메서드
   *
   * @author jochongs
   *
   * @param idx 리뷰 식별자
   * @param readUser 조회한 사용자 인덱스
   */
  @Transactional()
  public async findReviewByIdx(
    idx: number,
    readUser?: number,
  ): Promise<ReviewModel | null> {
    const review = await this.reviewCoreRepository.selectReviewByIdx(
      idx,
      readUser,
    );

    return review && ReviewModel.fromPrisma(review);
  }

  /**
   * 리뷰 생성하는 메서드
   *
   * @author jochongs
   *
   * @param input 생설할 리뷰 정보
   * @param userIdx 작성자 식별자
   * @param cultureContentIdx 연결된 문화생활컨텐츠 식별자
   */
  @Transactional()
  public async createReview(
    input: CreateReviewInput,
    userIdx: number,
    cultureContentIdx: number,
  ): Promise<ReviewModel> {
    return ReviewModel.fromPrisma(
      await this.reviewCoreRepository.insertReview(
        input,
        userIdx,
        cultureContentIdx,
      ),
    );
  }

  /**
   * 리뷰 업데이트 메서드
   *
   * @author jochongs
   *
   * @param idx 수정할 리뷰 식별자
   * @param input 수정할 리뷰 정보
   */
  @Transactional()
  public async updateReviewByIdx(
    idx: number,
    input: UpdateReviewInput,
  ): Promise<void> {
    return await this.reviewCoreRepository.updateReviewByIdx(idx, input);
  }

  /**
   * 리뷰 삭제 메서드
   *
   * @author jochongs
   *
   * @param idx 삭제할 리뷰 식별자
   */
  @Transactional()
  public async deleteReviewByIdx(idx: number): Promise<void> {
    return await this.reviewCoreRepository.softDeleteReviewByIdx(idx);
  }
}
