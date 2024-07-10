import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { SummaryTosEntity } from './entity/summary-tos.entity';
import { TosEntity } from './entity/tos.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class TosService {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(TosService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 약관 목록 가져오기
   */
  public async getTosAll(): Promise<SummaryTosEntity[]> {
    this.logger.log(this.getTosAll, 'SELECT terms of services');
    const tosList = await this.prisma.tos.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'asc',
      },
    });

    return tosList.map((tos) => SummaryTosEntity.createEntity(tos));
  }

  /**
   * 약관 자세히보기
   */
  public async getTosByIdx(idx: number): Promise<TosEntity> {
    this.logger.log(this.getTosByIdx, `SELECT terms of services ${idx}`);
    const tos = await this.prisma.tos.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });

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
