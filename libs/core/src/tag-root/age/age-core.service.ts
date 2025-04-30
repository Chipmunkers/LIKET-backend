import { Injectable } from '@nestjs/common';
import { AgeCoreRepository } from 'libs/core/tag-root/age/age-core.repository';
import { AgeModel } from 'libs/core/tag-root/age/model/age.model';

@Injectable()
export class AgeCoreService {
  constructor(private readonly ageCoreRepository: AgeCoreRepository) {}

  /**
   * 연령대 목록 가져오기
   *
   * @author jochongs
   */
  public async findAgeAll(): Promise<AgeModel[]> {
    return (
      await this.ageCoreRepository.selectAgeAll({
        order: 'asc',
        orderBy: 'idx',
      })
    ).map(AgeModel.fromPrisma);
  }

  /**
   * 연령대 가져오기
   *
   * @author jochongs
   *
   * @param idx 연령대 식별자
   */
  public async findAgeByIdx(idx: number): Promise<AgeModel | null> {
    const age = await this.ageCoreRepository.selectAgeByIdx(idx);

    return age && AgeModel.fromPrisma(age);
  }
}
