import { Injectable } from '@nestjs/common';
import { AlreadyExistLiketException } from 'libs/core/liket/exception/AlreadyExistLiketException';
import { CreateLiketInput } from 'libs/core/liket/input/create-liket.input';
import { FindLiketAllInput } from 'libs/core/liket/input/find-liket-all.input';
import { UpdateLiketInput } from 'libs/core/liket/input/update-liket.input';
import { LiketCoreRepository } from 'libs/core/liket/liket-core.repository';
import { LiketModel } from 'libs/core/liket/model/liket.model';
import { SummaryLiketModel } from 'libs/core/liket/model/summary-liket.model';

@Injectable()
export class LiketCoreService {
  constructor(private readonly liketCoreRepository: LiketCoreRepository) {}

  /**
   * 라이켓 목록 가져오기
   *
   * @author jochongs
   */
  public async findLiketAll(
    input: FindLiketAllInput,
  ): Promise<SummaryLiketModel[]> {
    return (await this.liketCoreRepository.selectLiketAll(input)).map(
      SummaryLiketModel.fromPrisma,
    );
  }

  /**
   * 라이켓 자세히보기
   *
   * @author jochongs
   *
   * @param idx 라이켓 식별자
   */
  public async findLiketByIdx(idx: number): Promise<LiketModel | null> {
    const liket = await this.liketCoreRepository.selectLiketByIdx(idx);

    return liket && LiketModel.fromPrisma(liket);
  }

  /**
   * 라이켓 자세히보기
   *
   * @author jochongs
   *
   * @param reviewIdx 리뷰 식별자
   */
  public async findLiketByReviewIdx(
    reviewIdx: number,
  ): Promise<LiketModel | null> {
    const liket =
      await this.liketCoreRepository.selectLiketByReviewIdx(reviewIdx);

    return liket && LiketModel.fromPrisma(liket);
  }

  /**
   * 라이켓 생성하기
   *
   * @author jochongs
   *
   * @param reviewIdx 연결된 리뷰 식별자
   *
   * @throws {} 409 - 이미 리뷰로 생성한 라이켓이 존재하는 경우
   */
  public async createLiket(
    reviewIdx: number,
    input: CreateLiketInput,
  ): Promise<LiketModel> {
    const alreadyExistLiket =
      await this.liketCoreRepository.selectLiketByReviewIdx(reviewIdx);

    if (alreadyExistLiket) {
      throw new AlreadyExistLiketException(
        'liket already exist with review idx',
      );
    }

    const createdLiket = await this.liketCoreRepository.insertLiket(
      reviewIdx,
      input,
    );

    return LiketModel.fromPrisma(createdLiket);
  }

  /**
   * 라이켓 업데이트하기
   *
   * @author jochongs
   *
   * @param idx 수정할 라이켓 식별자
   */
  public async updateLiketByIdx(
    idx: number,
    input: UpdateLiketInput,
  ): Promise<void> {
    return await this.liketCoreRepository.updateLiketByIdx(idx, input);
  }

  /**
   * 라이켓 삭제하기
   *
   * @author jochongs
   *
   * @param idx 삭제할 라이켓 식별자
   */
  public async deleteLiketByIdx(idx: number): Promise<void> {
    return await this.liketCoreRepository.softDeleteLiketByIdx(idx);
  }
}
