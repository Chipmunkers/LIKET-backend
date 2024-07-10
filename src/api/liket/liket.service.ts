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
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class LiketService {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(LiketService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 라이켓 자세히보기
   */
  public async getLiketByIdx(idx: number): Promise<LiketEntity> {
    this.logger.log(this.getLiketByIdx, `SELECT liket ${idx}`);
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
      this.logger.warn(
        this.getLiketByIdx,
        'Attempt to find non-existent liket',
      );
      throw new LiketNotFoundException('Cannot find LIKET');
    }

    return LiketEntity.createEntity(liket);
  }

  /**
   * 라이켓 목록 보기
   */
  public async getLiketAll(
    loginUser: LoginUser,
    pagerble: LiketPagerbleDto,
  ): Promise<{
    liketList: SummaryLiketEntity[];
    count: number;
  }> {
    const where: Prisma.LiketWhereInput = {
      userIdx: pagerble.user,
      deletedAt: null,
      Review: {
        deletedAt: null,
      },
    };

    this.logger.log(this.getLiketAll, 'SELECT likets and count');
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
  }

  /**
   * 라이켓 생성하기
   */
  public async createLiket(
    reviewIdx: number,
    loginUser: LoginUser,
    createDto: CreateLiketDto,
  ): Promise<LiketEntity> {
    const createdLiket = await this.prisma.$transaction(
      async (tx) => {
        this.logger.log(this.createLiket, 'SELECT liket');
        const liket = await tx.liket.findFirst({
          where: {
            userIdx: loginUser.idx,
            reviewIdx,
            deletedAt: null,
          },
        });

        if (liket) {
          this.logger.warn(
            this.createLiket,
            'Attempt to create like when in already has liket',
          );
          throw new AlreadyExistLiketException('Already exist LIKET');
        }

        this.logger.log(this.createLiket, 'INSERT liket');
        return tx.liket.create({
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
            imgPath: createDto.img,
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
  }

  /**
   * 라이켓 수정하기
   */
  public async updateLiketByIdx(
    idx: number,
    updateDto: UpdateLiketDto,
  ): Promise<void> {
    this.logger.log(this.updateLiketByIdx, 'UPDATE liket');
    await this.prisma.liket.update({
      where: {
        idx,
      },
      data: {
        description: updateDto.description,
      },
    });

    return;
  }

  /**
   * 라이켓 삭제하기
   */
  public async deleteLiketByIdx(idx: number): Promise<void> {
    this.logger.log(this.deleteLiketByIdx, 'DELETE liket');
    await this.prisma.liket.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  }
}
