import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { CreateLiketDto } from './dto/create-liket.dto';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { AlreadyExistLiketException } from './exception/AlreadyExistLiketException';
import { UploadService } from '../upload/upload.service';
import { FILE_GROUPING } from '../upload/file-grouping';
import { LiketNotFoundException } from './exception/LiketNotFoundException';
import { UpdateLiketDto } from './dto/update-liket.dto';
import { GetMyLiketPagerbleDto } from '../user/dto/get-my-liket-all-pagerble.dto';
import { LiketEntity } from './entity/liket.entity';
import { SummaryLiketEntity } from './entity/summary-liket.entity';

@Injectable()
export class LiketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Get liket by idx
   */
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

  /**
   * Get all liket by user idx
   */
  getAllLiketByUserIdx: (
    userIdx: number,
    pagerble: GetMyLiketPagerbleDto,
  ) => Promise<SummaryLiketEntity[]> = async (userIdx, pagerble) => {
    const liketList = await this.prisma.liket.findMany({
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
        userIdx,
        deletedAt: null,
        Review: {
          deletedAt: null,
        },
      },
      orderBy: {
        idx: 'desc',
      },
      take: 10,
      skip: (pagerble.page - 1) * 10,
    });

    return liketList.map((liket) => LiketEntity.createEntity(liket));
  };

  /**
   * Create LIKET
   */
  createLiket: (
    reviewIdx: number,
    loginUser: LoginUserDto,
    createDto: CreateLiketDto,
  ) => Promise<LiketEntity> = async (reviewIdx, loginUser, createDto) => {
    await this.uploadService.checkExistFile(
      createDto.img.filePath,
      FILE_GROUPING.LIKET,
    );

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

  /**
   * Update LIKET
   */
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

  /**
   * Delete LIKET
   */
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
