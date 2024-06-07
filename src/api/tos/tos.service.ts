import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { SummaryTosEntity } from './entity/summary-tos.entity';
import { TosEntity } from './entity/tos.entity';

@Injectable()
export class TosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all TOS
   */
  public getTosAll: () => Promise<SummaryTosEntity[]> = async () => {
    const tosList = await this.prisma.tos.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'asc',
      },
    });

    return tosList.map((tos) => SummaryTosEntity.createEntity(tos));
  };

  /**
   * Get a detail TOS
   */
  public getTosByIdx: (idx: number) => Promise<TosEntity> = async (idx) => {
    const tos = await this.prisma.tos.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!tos) {
      throw new NotFoundException('Cannot find Terms Of Service');
    }

    return TosEntity.createEntity(tos);
  };
}
