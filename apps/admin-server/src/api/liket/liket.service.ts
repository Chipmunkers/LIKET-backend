import { Injectable } from '@nestjs/common';
import { Prisma } from '../../common/prisma/prisma.service';
import { GetLiketAllPagerbleDto } from './dto/request/get-liket-all-pagerble.dto';
import { LiketEntity } from './entity/liket.entity';
import { LiketNotFoundException } from './exception/LiketNotFoundException';

@Injectable()
export class LiketService {
  constructor(private readonly prisma: Prisma) {}

  getLiketAll: (
    pagerble: GetLiketAllPagerbleDto,
  ) => Promise<{ liketList: LiketEntity[]; count: number }> = async (pagerble) => {
    const [liketList, count] = await this.prisma.$transaction([
      this.prisma.liket.findMany({
        include: {
          Review: {
            include: {
              CultureContent: {
                include: {
                  Genre: true,
                  Location: true,
                  ContentImg: {
                    where: {
                      deletedAt: null,
                    },
                  },
                },
              },
              ReviewImg: {
                where: {
                  deletedAt: null,
                },
              },
            },
          },
          User: true,
        },
        where: {
          deletedAt: null,
          Review: {
            deletedAt: null,
            CultureContent:
              pagerble.searchby === 'review'
                ? {
                    title: pagerble.search || '',
                  }
                : undefined,
          },
          User: {
            nickname:
              pagerble.searchby === 'nickname'
                ? {
                    contains: pagerble.search || '',
                  }
                : undefined,
            deletedAt: null,
          },
        },
        orderBy: {
          idx: pagerble.order,
        },
        take: 5,
        skip: (pagerble.page - 1) * 5,
      }),
      this.prisma.liket.count({
        where: {
          deletedAt: null,
          Review: {
            deletedAt: null,
            CultureContent:
              pagerble.searchby === 'review'
                ? {
                    title: pagerble.search || '',
                  }
                : undefined,
          },
          User: {
            nickname:
              pagerble.searchby === 'nickname'
                ? {
                    contains: pagerble.search || '',
                  }
                : undefined,
            deletedAt: null,
          },
        },
      }),
    ]);

    return {
      liketList: liketList.map((liket) => LiketEntity.createEntity(liket)),
      count,
    };
  };

  getLiketByIdx: (idx: number) => Promise<LiketEntity> = async (idx) => {
    const liket = await this.prisma.liket.findUnique({
      include: {
        Review: {
          include: {
            CultureContent: {
              include: {
                Genre: true,
                Location: true,
                ContentImg: {
                  where: {
                    deletedAt: null,
                  },
                },
              },
            },
            ReviewImg: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
        User: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!liket) {
      throw new LiketNotFoundException('Cannot find liket');
    }

    return LiketEntity.createEntity(liket);
  };

  deleteLiketByidx: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.liket.update({
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
