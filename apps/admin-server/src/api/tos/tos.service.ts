import { Injectable } from '@nestjs/common';
import { Prisma } from '../../common/prisma/prisma.service';
import { TosEntity } from './entity/tos.entity';
import { CreateTosDto } from './dto/request/create-tos.dto';
import { UpdateTosDto } from './dto/request/update-tos.dto';
import { SummaryTosEntity } from './entity/summary-tos.entity';
import { TosNotFoundException } from './exception/TosNotFoundException';

@Injectable()
export class TosService {
  constructor(private readonly prisma: Prisma) {}

  getTosAll: () => Promise<{
    tosList: SummaryTosEntity[];
    count: number;
  }> = async () => {
    const [tosList, count] = await this.prisma.$transaction([
      this.prisma.tos.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          idx: 'desc',
        },
      }),
      this.prisma.tos.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      tosList: tosList.map((tos) => SummaryTosEntity.createEntity(tos)),
      count,
    };
  };

  getTosByIdx: (idx: number) => Promise<TosEntity> = async (idx) => {
    const tos = await this.prisma.tos.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!tos) {
      throw new TosNotFoundException('Cannot find Terms of Service');
    }

    return TosEntity.createEntity(tos);
  };

  createTos: (createDto: CreateTosDto) => Promise<TosEntity> = async (createDto) => {
    const createdTos = await this.prisma.tos.create({
      data: {
        title: createDto.title,
        contents: createDto.contents,
        isEssential: createDto.isEssential,
      },
    });

    return TosEntity.createEntity(createdTos);
  };

  updateTosByIdx: (idx: number, updateDto: UpdateTosDto) => Promise<void> = async (
    idx,
    udpateDto,
  ) => {
    await this.prisma.tos.update({
      where: { idx },
      data: {
        title: udpateDto.title,
        contents: udpateDto.contents,
        isEssential: udpateDto.isEssential,
      },
    });

    return;
  };

  deleteTosByIdx: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.tos.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  };
}
