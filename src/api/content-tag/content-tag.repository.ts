import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class ContentTagRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(ContentTagRepository.name) private readonly logger: LoggerService,
  ) {}

  public selectGenreAll() {
    this.logger.log(this.selectGenreAll, 'SELECT genre');
    return this.prisma.genre.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'desc',
      },
    });
  }

  public selectAgeAll() {
    this.logger.log(this.selectStyleAll, 'SELECT age');
    return this.prisma.age.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'desc',
      },
    });
  }

  public selectAgeByIdx(idx: number) {
    return this.prisma.age.findUniqueOrThrow({
      where: {
        idx,
      },
    });
  }

  public selectStyleAll() {
    this.logger.log(this.selectStyleAll, 'SELECT styles');
    return this.prisma.style.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'desc',
      },
    });
  }

  public selectHotStyle() {
    return this.prisma.style
      .findMany({
        select: {
          idx: true,
          name: true,
          _count: {
            select: {
              Style: {
                where: {
                  CultureContent: {
                    deletedAt: null,
                    acceptedAt: {
                      not: null,
                    },
                  },
                },
              },
            },
          },
        },
      })
      .then((styles) =>
        styles.sort((prev, next) => next._count.Style - prev._count.Style),
      )
      .then((styles) => styles[0]);
  }
}
