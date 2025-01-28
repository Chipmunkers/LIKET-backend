import { Injectable } from '@nestjs/common';
import { CreateLiketDto } from './dto/create-liket.dto';
import { UpdateLiketDto } from './dto/update-liket.dto';
import { LiketPageableDto } from './dto/liket-pageable.dto';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class LiketRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * @author wherehows
   */
  public async insertLiket(reviewIdx: number, insertDto: CreateLiketDto) {
    return await this.prisma.liket.create({
      include: {
        LiketImgShape: true,
        Review: {
          include: {
            User: true,
            CultureContent: {
              include: {
                Genre: true,
                Location: true,
              },
            },
          },
        },
      },
      data: {
        reviewIdx,
        cardImgPath: insertDto.cardImgPath,
        description: insertDto.description,
        size: insertDto.size,
        textShape: insertDto.textShape ? { ...insertDto.textShape } : undefined,
        bgImgInfo: {
          ...insertDto.bgImgInfo,
        },
        bgImgPath: insertDto.bgImgPath,
        LiketImgShape: {
          createMany: {
            data: insertDto.imgShapes.map((imgShape) => ({
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
   * @author wherehows
   */
  public async updateLiketByIdx(idx: number, updateDto: UpdateLiketDto) {
    return this.prisma.liket.update({
      where: {
        idx,
      },
      data: {
        cardImgPath: updateDto.cardImgPath,
        description: updateDto.description,
        size: updateDto.size,
        textShape: {
          ...updateDto.textShape,
        },
        bgImgInfo: {
          ...updateDto.bgImgInfo,
        },
        bgImgPath: updateDto.bgImgPath,
        LiketImgShape: {
          deleteMany: {},
          createMany: {
            data: updateDto.imgShapes.map((imgShape) => ({
              imgShape: {
                ...imgShape,
              },
            })),
          },
        },
      },
      include: {
        LiketImgShape: true,
      },
    });
  }

  /**
   * @author wherehows
   */
  public async deleteLiketByIdx(idx: number) {
    return this.prisma.liket.update({
      where: { idx },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * @author wherehows
   */
  public async selectLiketByIdx(idx: number) {
    return await this.prisma.liket.findUnique({
      include: {
        LiketImgShape: true,
        Review: {
          include: {
            User: true,
            CultureContent: {
              include: {
                Genre: true,
                Location: true,
              },
            },
          },
        },
      },
      where: {
        idx,
        deletedAt: null,
        Review: {
          deletedAt: null,
        },
      },
    });
  }

  /**
   * @author wherehows
   */
  public async selectLiketAll(pageable: LiketPageableDto) {
    const liketList = await this.prisma.liket.findMany({
      include: {
        LiketImgShape: true,
        Review: {
          include: {
            User: true,
          },
        },
      },
      orderBy: {
        idx: pageable.orderby === 'time' ? pageable.order : undefined,
      },
      where: {
        deletedAt: null,
        Review: {
          User: {
            idx: pageable.user,
          },
          deletedAt: null,
        },
      },
      take: 10,
      skip: (pageable.page - 1) * 10,
    });

    return liketList;
  }

  /**
   * @author wherehows
   */
  public async selectLiketByReviewIdx(reviewIdx: number) {
    return await this.prisma.liket.findFirst({
      where: {
        reviewIdx,
        deletedAt: null,
        Review: {
          deletedAt: null,
        },
      },
    });
  }

  /**
   * 유저가 작성한 라이켓의 총 개수 가져오기.
   *
   * @author wherehows
   *
   * @param userIdx 유저의 인덱스
   */
  public selectLiketCountByUserIdx(userIdx: number) {
    return this.prisma.liket.count({
      where: {
        deletedAt: null,
        Review: {
          userIdx,
          deletedAt: null,
        },
      },
    });
  }
}
