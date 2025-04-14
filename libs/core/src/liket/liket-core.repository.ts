import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { LiketSelectField } from 'libs/core/liket/model/prisma/liket-select-field';
import { CreateLiketInput } from 'libs/core/liket/input/create-liket.input';
import { UpdateLiketInput } from 'libs/core/liket/input/update-liket.input';

@Injectable()
export class LiketCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT liket_tb WHERE idx = $1
   *
   * @author jochongs
   */
  public async selectLiketByIdx(idx: number): Promise<LiketSelectField | null> {
    return await this.txHost.tx.liket.findUnique({
      select: {
        idx: true,
        cardImgPath: true,
        size: true,
        textShape: true,
        bgImgPath: true,
        LiketImgShape: {
          select: {
            imgShape: true,
          },
        },
        bgImgInfo: true,
        Review: {
          select: {
            idx: true,
            visitTime: true,
            starRating: true,
            CultureContent: {
              select: {
                idx: true,
                title: true,
                Genre: {
                  select: {
                    idx: true,
                    name: true,
                    createdAt: true,
                  },
                },
                Location: {
                  select: {
                    idx: true,
                    address: true,
                    detailAddress: true,
                    region1Depth: true,
                    region2Depth: true,
                    hCode: true,
                    bCode: true,
                    positionX: true,
                    positionY: true,
                    sidoCode: true,
                    sggCode: true,
                    legCode: true,
                    riCode: true,
                  },
                },
              },
            },
            User: {
              select: {
                idx: true,
                profileImgPath: true,
                nickname: true,
                provider: true,
              },
            },
          },
        },
      },
      where: {
        idx,
        deletedAt: null,
        Review: {
          User: {
            deletedAt: null,
            blockedAt: null,
          },
        },
      },
    });
  }

  /**
   * INSERT liket_tb
   *
   * @author jochongs
   *
   * @param reviewIdx 리뷰 식별자
   */
  public async insertLiket(
    reviewIdx: number,
    input: CreateLiketInput,
  ): Promise<LiketSelectField> {
    return await this.txHost.tx.liket.create({
      select: {
        idx: true,
        cardImgPath: true,
        size: true,
        textShape: true,
        bgImgPath: true,
        LiketImgShape: {
          select: {
            imgShape: true,
          },
        },
        bgImgInfo: true,
        Review: {
          select: {
            idx: true,
            visitTime: true,
            starRating: true,
            CultureContent: {
              select: {
                idx: true,
                title: true,
                Genre: {
                  select: {
                    idx: true,
                    name: true,
                    createdAt: true,
                  },
                },
                Location: {
                  select: {
                    idx: true,
                    address: true,
                    detailAddress: true,
                    region1Depth: true,
                    region2Depth: true,
                    hCode: true,
                    bCode: true,
                    positionX: true,
                    positionY: true,
                    sidoCode: true,
                    sggCode: true,
                    legCode: true,
                    riCode: true,
                  },
                },
              },
            },
            User: {
              select: {
                idx: true,
                profileImgPath: true,
                nickname: true,
                provider: true,
              },
            },
          },
        },
      },
      data: {
        reviewIdx,
        cardImgPath: input.cardImgPath,
        description: input.description,
        size: input.size,
        textShape: input.textShape ? { ...input.textShape } : undefined,
        bgImgInfo: {
          ...input.bgImgInfo,
        },
        bgImgPath: input.bgImgPath,
        LiketImgShape: {
          createMany: {
            data: input.imgShapes.map((imgShape) => ({
              imgShape: {
                ...imgShape,
              },
            })),
          },
        },
      },
    });
  }

  /**
   * UPDATE liket_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 라이켓 식별자
   */
  public async updateLiketByIdx(
    idx: number,
    input: UpdateLiketInput,
  ): Promise<void> {
    await this.txHost.tx.liket.update({
      where: {
        idx,
        deletedAt: null,
      },
      data: {
        cardImgPath: input.cardImgPath,
        description: input.description,
        size: input.size,
        textShape:
          input.textShape !== undefined
            ? {
                ...input.textShape,
              }
            : input.textShape === null
              ? {}
              : undefined,
        bgImgInfo: input.bgImgInfo
          ? {
              ...input.bgImgInfo,
            }
          : undefined,
        bgImgPath: input.bgImgPath ? input.bgImgPath : undefined,
        LiketImgShape: input.imgShapes
          ? {
              deleteMany: {},
              createMany: {
                data: input.imgShapes.map((imgShape) => ({
                  imgShape: {
                    ...imgShape,
                  },
                })),
              },
            }
          : undefined,
      },
    });
  }
}
