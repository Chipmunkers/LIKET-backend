import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindTosAllInput } from 'libs/core/tos/input/find-tos-all.input';
import { SummaryTosModel } from 'libs/core/tos/model/summary-tos.model';
import { TosModel } from 'libs/core/tos/model/tos.model';
import { TosCoreRepository } from 'libs/core/tos/tos-core.repository';

@Injectable()
export class TosCoreService {
  constructor(private readonly tosCoreRepository: TosCoreRepository) {}

  /**
   * 약관 목록보기
   *
   * @author jochongs
   */
  public async findTosAll(input: FindTosAllInput): Promise<SummaryTosModel[]> {
    return (await this.tosCoreRepository.selectTosAll(input)).map(
      SummaryTosModel.fromPrisma,
    );
  }

  /**
   * 약관 가져오기
   *
   * @author jochongs
   *
   * @param idx 약관 식별자
   */
  @Transactional()
  public async findTosByIdx(idx: number): Promise<TosModel | null> {
    const tos = await this.tosCoreRepository.selectTosByIdx(idx);

    return tos && TosModel.fromPrisma(tos);
  }
}
