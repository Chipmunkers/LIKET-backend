import { Injectable } from '@nestjs/common';
import { FindLiketAllInput } from 'libs/core/liket/input/find-liket-all.input';
import { LiketCoreRepository } from 'libs/core/liket/liket-core.repository';
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
}
