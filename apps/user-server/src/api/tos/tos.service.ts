import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { SummaryTosEntity } from './entity/summary-tos.entity';
import { TosEntity } from './entity/tos.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { TosRepository } from './tos.repository';

@Injectable()
export class TosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tosRepository: TosRepository,
    @Logger(TosService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 약관 목록 가져오기
   */
  public async getTosAll(): Promise<SummaryTosEntity[]> {
    const tosList = await this.tosRepository.selectTosAll();

    return tosList.map((tos) => SummaryTosEntity.createEntity(tos));
  }

  /**
   * 약관 자세히보기
   */
  public async getTosByIdx(idx: number): Promise<TosEntity> {
    const tos = await this.tosRepository.selectTosByIdx(idx);

    if (!tos) {
      this.logger.warn(
        this.getTosByIdx,
        'Attempt to find non-existent Terms of service',
      );
      throw new NotFoundException('Cannot find terms Of Service');
    }

    return TosEntity.createEntity(tos);
  }
}
