import { Injectable } from '@nestjs/common';
import { CreateLiketInput } from 'libs/core/liket/input/create-liket.input';
import { FindLiketAllInput } from 'libs/core/liket/input/find-liket-all.input';
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
   * 라이켓 생성하기
   *
   * @author jochongs
   *
   * @param reviewIdx 연결된 리뷰 식별자
   */
  public async createLiket(
    reviewIdx: number,
    input: CreateLiketInput,
  ): Promise<LiketModel> {
    const createdLiket = await this.liketCoreRepository.insertLiket(
      reviewIdx,
      input,
    );

    return LiketModel.fromPrisma(createdLiket);
  }
}
