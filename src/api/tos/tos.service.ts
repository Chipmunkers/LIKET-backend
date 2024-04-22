import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTosDto } from './dto/CreateTosDto';
import { UpdateTosDto } from './dto/UpdateTosDto';
import { TosEntity } from './entity/TosEntity';

@Injectable()
export class TosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all TOS
   */
  public getTosAll: () => Promise<TosEntity<'summary'>[]> = async () => {
    const tosList = await this.prisma.tos.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'asc',
      },
    });

    return tosList.map((tos) => TosEntity.createUserSummaryTos(tos));
  };

  /**
   * Get a detail TOS
   */
  public getTosByIdx: (idx: number) => Promise<TosEntity<'detail'>> = async (
    idx,
  ) => {
    const tos = await this.prisma.tos.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!tos) {
      throw new NotFoundException('Cannot find Terms Of Service');
    }

    return TosEntity.createUserDetailTos(tos);
  };
}
