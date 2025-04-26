import { Injectable } from '@nestjs/common';
import { TosModel } from 'libs/core/tos/model/tos.model';
import { TosCoreRepository } from 'libs/core/tos/tos-core.repository';

@Injectable()
export class TosCoreService {
  constructor(private readonly tosCoreRepository: TosCoreRepository) {}

  /**
   * 약관 가져오기
   *
   * @author jochongs
   *
   * @param idx 약관 식별자
   */
  public async findTosByIdx(idx: number): Promise<TosModel | null> {
    const tos = await this.tosCoreRepository.selectTosByIdx(idx);

    return tos && TosModel.fromPrisma(tos);
  }
}
