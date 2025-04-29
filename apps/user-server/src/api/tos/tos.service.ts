import { Injectable, NotFoundException } from '@nestjs/common';
import { SummaryTosEntity } from './entity/summary-tos.entity';
import { TosEntity } from './entity/tos.entity';
import { TosCoreService } from 'libs/core/tos/tos-core.service';
import { SummaryTosModel } from 'libs/core/tos/model/summary-tos.model';

@Injectable()
export class TosService {
  constructor(private readonly tosCoreService: TosCoreService) {}

  /**
   * 약관 목록 가져오기
   *
   * @author jochongs
   */
  public async getTosAll(): Promise<SummaryTosEntity[]> {
    const tosList = await this.tosCoreService.findTosAll({
      page: 1,
      row: 50,
    });

    return tosList.map(SummaryTosModel.fromPrisma);
  }

  /**
   * 약관 자세히보기
   *
   * @author jochongs
   */
  public async getTosByIdx(idx: number): Promise<TosEntity> {
    const tos = await this.tosCoreService.findTosByIdx(idx);

    if (!tos) {
      throw new NotFoundException('Cannot find terms Of Service');
    }

    return TosEntity.fromModel(tos);
  }
}
