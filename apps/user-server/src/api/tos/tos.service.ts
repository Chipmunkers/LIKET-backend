import { Injectable, NotFoundException } from '@nestjs/common';
import { SummaryTosEntity } from './entity/summary-tos.entity';
import { TosEntity } from './entity/tos.entity';
import { TosRepository } from './tos.repository';

@Injectable()
export class TosService {
  constructor(private readonly tosRepository: TosRepository) {}

  /**
   * 약관 목록 가져오기
   *
   * @author jochongs
   */
  public async getTosAll(): Promise<SummaryTosEntity[]> {
    const tosList = await this.tosRepository.selectTosAll();

    return tosList.map((tos) => SummaryTosEntity.createEntity(tos));
  }

  /**
   * 약관 자세히보기
   *
   * @author jochongs
   */
  public async getTosByIdx(idx: number): Promise<TosEntity> {
    const tos = await this.tosRepository.selectTosByIdx(idx);

    if (!tos) {
      throw new NotFoundException('Cannot find terms Of Service');
    }

    return TosEntity.createEntity(tos);
  }
}
