import { PrismaService } from '../../common/module/prisma/prisma.service';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { Prisma } from '@prisma/client';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class CultureContentRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(CultureContentRepository.name)
    private readonly logger: LoggerService,
  ) {}

  public selectCultureContentByIdx(idx: number, userIdx?: number) {
    this.logger.log(
      this.selectCultureContentByIdx,
      `SELECT culture content WHERE idx = ${idx}`,
    );
    return this.prisma.cultureContent.findUnique({
      include: {
        User: true,
        ContentImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        Genre: true,
        Style: {
          include: {
            Style: true,
          },
        },
        Age: true,
        Location: true,
        ContentLike: {
          where: {
            userIdx: userIdx || -1,
          },
        },
        _count: {
          select: {
            Review: {
              where: {
                deletedAt: null,
                User: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      },
      where: {
        idx,
        deletedAt: null,
        User: {
          deletedAt: null,
          blockedAt: null,
        },
      },
    });
  }

  public selectCultureContentAll(
    pagerble: ContentPagerbleDto,
    userIdx?: number,
  ) {
    const where: Prisma.CultureContentWhereInput = {
      genreIdx: pagerble.genre || undefined,
      ageIdx: pagerble.age || undefined,
      title: pagerble.search && {
        contains: pagerble.search,
      },
      Style: pagerble.style
        ? {
            some: {
              styleIdx: {
                in: pagerble.style,
              },
            },
          }
        : undefined,
      Location: pagerble.region
        ? {
            sidoCode: pagerble.region,
          }
        : undefined,
      startDate: pagerble.open
        ? {
            lte: new Date(),
          }
        : undefined,
      endDate: pagerble.open
        ? {
            gte: new Date(),
          }
        : undefined,
      acceptedAt:
        pagerble.accept !== undefined
          ? pagerble.accept
            ? {
                not: null,
              }
            : null
          : undefined,
      deletedAt: null,
      User: {
        idx: pagerble.user,
      },
    };

    this.logger.log(
      this.selectCultureContentAll,
      'SELECT culture content, count',
    );
    return this.prisma.cultureContent.findMany({
      include: {
        User: true,
        ContentImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        Genre: true,
        Style: {
          include: {
            Style: true,
          },
          where: {
            Style: {
              deletedAt: null,
            },
          },
        },
        Age: true,
        Location: true,
        ContentLike: {
          where: {
            userIdx: userIdx || -1,
          },
        },
      },
      where,
      orderBy: {
        [this.getOrderBy(pagerble.orderby)]: pagerble.order,
      },
      take: 12,
      skip: (pagerble.page - 1) * 12,
    });
  }

  private getOrderBy(
    orderby: 'time' | 'like' | 'create',
  ): 'acceptedAt' | 'likeCount' | 'idx' {
    if (orderby === 'time') {
      return 'acceptedAt';
    }

    if (orderby === 'like') {
      return 'likeCount';
    }

    return 'idx';
  }

  public selectSoonOpenCultureContentAll(userIdx?: number) {
    this.logger.log(
      this.selectSoonOpenCultureContentAll,
      'SELECT soon open culture content',
    );
    return this.prisma.cultureContent.findMany({
      include: {
        User: true,
        ContentImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        Genre: true,
        Style: {
          include: {
            Style: true,
          },
          where: {
            Style: {
              deletedAt: null,
            },
          },
        },
        Age: true,
        Location: true,
        ContentLike: {
          where: {
            userIdx: userIdx || -1,
          },
        },
      },
      where: {
        startDate: {
          gte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
        deletedAt: null,
        acceptedAt: {
          not: null,
        },
        User: {
          deletedAt: null,
          blockedAt: null,
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 5,
    });
  }

  public selectSoonEndCultureContentAll(userIdx?: number) {
    this.logger.log(
      this.selectSoonEndCultureContentAll,
      'SELECT soon end culture content',
    );
    return this.prisma.cultureContent.findMany({
      include: {
        User: true,
        ContentImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        Genre: true,
        Style: {
          include: {
            Style: true,
          },
          where: {
            Style: {
              deletedAt: null,
            },
          },
        },
        Age: true,
        Location: true,
        ContentLike: {
          where: {
            userIdx: userIdx || -1,
          },
        },
      },
      where: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
        deletedAt: null,
        acceptedAt: {
          not: null,
        },
        User: {
          deletedAt: null,
          blockedAt: null,
        },
      },
      orderBy: {
        endDate: 'asc',
      },
      take: 5,
    });
  }

  public selectHotCultureContentAll() {
    this.logger.log(
      this.selectHotCultureContentAll,
      'SELECT hot culture content',
    );

    return this.prisma.genre.findMany({
      include: {
        CultureContent: {
          include: {
            ContentImg: {
              where: {
                deletedAt: null,
              },
              orderBy: {
                idx: 'asc',
              },
            },
          },
          where: {
            deletedAt: null,
            acceptedAt: {
              not: null,
            },
            User: {
              deletedAt: null,
              blockedAt: null,
            },
            likeCount: {
              not: 0,
            },
            startDate: {
              lte: new Date(),
            },
            endDate: {
              gte: new Date(),
            },
          },
          take: 4,
          orderBy: {
            likeCount: 'desc',
          },
        },
      },
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'asc',
      },
    });
  }

  public selectHotCultureContentByAgeIdx(ageIdx: number, userIdx?: number) {
    this.logger.log(
      this.selectHotCultureContentByAgeIdx,
      `SELECT hot culture content WHERE age_idx = ${ageIdx}`,
    );
    return this.prisma.cultureContent.findMany({
      include: {
        User: true,
        ContentImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        Genre: true,
        Style: {
          include: {
            Style: true,
          },
          where: {
            Style: {
              deletedAt: null,
            },
          },
        },
        Age: true,
        Location: true,
        ContentLike: {
          where: {
            userIdx: userIdx || -1,
          },
        },
      },
      where: {
        deletedAt: null,
        acceptedAt: {
          not: null,
        },
        User: {
          deletedAt: null,
          blockedAt: null,
        },
        ageIdx,
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        likeCount: 'desc',
      },
      take: 5,
    });
  }

  public selectHotCultureContentByStyleIdx(styleIdx: number, userIdx?: number) {
    this.logger.log(
      this.selectHotCultureContentByStyleIdx,
      `SELECT hot culture content WHERE style_idx = ${styleIdx}`,
    );
    return this.prisma.cultureContent.findMany({
      include: {
        User: true,
        ContentImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        Genre: true,
        Style: {
          include: {
            Style: true,
          },
          where: {
            Style: {
              deletedAt: null,
            },
          },
        },
        Age: true,
        Location: true,
        ContentLike: {
          where: {
            userIdx: userIdx || -1,
          },
        },
      },
      where: {
        deletedAt: null,
        acceptedAt: {
          not: null,
        },
        User: {
          deletedAt: null,
          blockedAt: null,
        },
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
        Style: {
          some: {
            Style: {
              idx: styleIdx,
            },
          },
        },
      },
      orderBy: {
        likeCount: 'desc',
      },
      take: 5,
    });
  }

  public insertCultureContent(
    userIdx: number,
    createDto: CreateContentRequestDto,
  ) {
    this.logger.log(this.insertCultureContent, 'INSERT culture content');
    return this.prisma.$transaction(async (tx) => {
      const createdLocation = await tx.location.create({
        data: {
          address: createDto.location.address,
          detailAddress: createDto.location.detailAddress,
          region1Depth: createDto.location.region1Depth,
          region2Depth: createDto.location.region2Depth,
          hCode: createDto.location.hCode,
          bCode: createDto.location.bCode,
          sidoCode: createDto.location.bCode.substring(0, 2),
          sggCode: createDto.location.bCode.substring(2, 5),
          legCode: createDto.location.bCode.substring(5, 8),
          riCode: createDto.location.bCode.substring(8, 10),
          positionX: createDto.location.positionX,
          positionY: createDto.location.positionY,
        },
      });

      const requestedCultureContent = await tx.cultureContent.create({
        data: {
          genreIdx: createDto.genreIdx,
          userIdx: userIdx,
          locationIdx: createdLocation.idx,
          ageIdx: createDto.ageIdx,
          Style: {
            createMany: {
              data: createDto.styleIdxList.map((style) => ({
                styleIdx: style,
              })),
            },
          },
          ContentImg: createDto.imgList?.length
            ? {
                createMany: {
                  data: createDto.imgList.map((img) => ({
                    imgPath: img,
                  })),
                },
              }
            : undefined,
          title: createDto.title,
          description: createDto.description,
          websiteLink: createDto.websiteLink,
          startDate: new Date(createDto.startDate),
          endDate: new Date(createDto.endDate),
          openTime: createDto.openTime,
          isFee: createDto.isFee,
          isReservation: createDto.isReservation,
          isParking: createDto.isParking,
          isPet: createDto.isPet,
        },
      });

      return requestedCultureContent.idx;
    });
  }

  public updateCultureContentByIdx(idx: number, updateDto: UpdateContentDto) {
    this.logger.log(
      this.updateCultureContentByIdx,
      `UPDATE culture content WHERE idx = ${idx}`,
    );
    return this.prisma.$transaction([
      this.prisma.location.update({
        where: {
          idx,
        },
        data: {
          ...updateDto.location,
        },
      }),
      this.prisma.cultureContent.update({
        where: {
          idx,
        },
        data: {
          title: updateDto.title,
          description: updateDto.description,
          websiteLink: updateDto.websiteLink,
          ContentImg: {
            updateMany: {
              where: {
                deletedAt: null,
              },
              data: {
                deletedAt: new Date(),
              },
            },
            createMany: updateDto.imgList
              ? {
                  data: updateDto.imgList.map((img) => ({
                    imgPath: img,
                  })),
                }
              : undefined,
          },
          genreIdx: updateDto.genreIdx,
          ageIdx: updateDto.ageIdx,
          Style: {
            deleteMany: {},
            createMany: {
              data: updateDto.styleIdxList.map((styleIdx) => ({ styleIdx })),
            },
          },
          startDate: new Date(updateDto.startDate),
          endDate: new Date(updateDto.endDate),
          openTime: updateDto.openTime,
          isFee: updateDto.isFee,
          isParking: updateDto.isParking,
          isReservation: updateDto.isReservation,
          isPet: updateDto.isPet,
        },
      }),
    ]);
  }

  public deleteContentRequest(idx: number) {
    this.logger.log(
      this.deleteContentRequest,
      `SOFT DELETE culture content WHERE idx = ${idx}`,
    );

    return this.prisma.cultureContent.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
