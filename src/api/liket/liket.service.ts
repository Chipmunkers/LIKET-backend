import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { CreateLiketDto } from './dto/create-liket.dto';
import { AlreadyExistLiketException } from './exception/AlreadyExistLiketException';
import { LiketNotFoundException } from './exception/LiketNotFoundException';
import { UpdateLiketDto } from './dto/update-liket.dto';
import { LiketEntity } from './entity/liket.entity';
import { SummaryLiketEntity } from './entity/summary-liket.entity';
import { Prisma } from '@prisma/client';
import { LiketPagerbleDto } from './dto/liket-pagerble.dto';
import { LoginUser } from '../auth/model/login-user';

@Injectable()
export class LiketService {
  constructor(private readonly prisma: PrismaService) {}

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
                  orderBy: {
                    idx: 'asc',
                  },
                },
              },
            },
            ReviewImg: {
              where: {
                deletedAt: null,
              },
              orderBy: {
                idx: 'asc',
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
      throw new LiketNotFoundException('Cannot find LIKET');
    }

    return LiketEntity.createEntity(liket);
  };

  getLiketAll: (
    loginUser: LoginUser,
    pagerble: LiketPagerbleDto,
  ) => Promise<{
    liketList: SummaryLiketEntity[];
    count: number;
  }> = async (loginUser, pagerble) => {
    const where: Prisma.LiketWhereInput = {
      userIdx: pagerble.user,
      deletedAt: null,
      Review: {
        deletedAt: null,
      },
    };

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
                    orderBy: {
                      idx: 'asc',
                    },
                  },
                },
              },
              ReviewImg: {
                where: {
                  deletedAt: null,
                },
                orderBy: {
                  idx: 'asc',
                },
              },
            },
          },
          User: true,
        },
        where,
        orderBy: {
          idx: 'desc',
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
      this.prisma.liket.count({ where }),
    ]);

    return {
      liketList: liketList.map((liket) => LiketEntity.createEntity(liket)),
      count,
    };
  };

  createLiket: (
    reviewIdx: number,
    loginUser: LoginUser,
    createDto: CreateLiketDto,
  ) => Promise<LiketEntity> = async (reviewIdx, loginUser, createDto) => {
    const createdLiket = await this.prisma.$transaction(
      async (tx) => {
        const liket = await tx.liket.findFirst({
          where: {
            userIdx: loginUser.idx,
            reviewIdx,
            deletedAt: null,
          },
        });

        if (liket) {
          throw new AlreadyExistLiketException('Already exist LIKET');
        }

        return await tx.liket.create({
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
                      orderBy: {
                        idx: 'asc',
                      },
                    },
                  },
                },
                ReviewImg: {
                  where: {
                    deletedAt: null,
                  },
                  orderBy: {
                    idx: 'asc',
                  },
                },
              },
            },
            User: true,
          },
          data: {
            imgPath: createDto.img.filePath,
            description: createDto.description,
            reviewIdx,
            userIdx: loginUser.idx,
          },
        });
      },
      {
        isolationLevel: 'Serializable',
      },
    );

    return LiketEntity.createEntity(createdLiket);
  };

  updateLiketByIdx: (idx: number, updateDto: UpdateLiketDto) => Promise<void> =
    async (idx, updateDto) => {
      await this.prisma.liket.update({
        where: {
          idx,
        },
        data: {
          description: updateDto.description,
        },
      });

      return;
    };

  deleteLiketByIdx: (idx: number) => Promise<void> = async (idx) => {
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
