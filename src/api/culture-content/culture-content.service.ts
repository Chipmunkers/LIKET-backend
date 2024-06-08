import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { ContentNotFoundException } from './exception/ContentNotFound';
import { AlreadyLikeContentException } from './exception/AlreadyLikeContentException';
import { AlreadyNotLikeContentException } from './exception/AlreadyNotLikeContentException';
import { UploadService } from '../upload/upload.service';
import { FILE_GROUPING } from '../upload/file-grouping';
import { ContentEntity } from './entity/content.entity';
import { SummaryContentEntity } from './entity/summary-content.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class CultureContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  public getContentByIdx: (
    idx: number,
    userIdx: number,
  ) => Promise<ContentEntity> = async (idx, userIdx) => {
    const content = await this.prisma.cultureContent.findUnique({
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
            userIdx,
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
        acceptedAt: {
          not: null,
        },
        deletedAt: null,
        User: {
          deletedAt: null,
          blockedAt: null,
        },
      },
    });

    if (!content) {
      throw new ContentNotFoundException('Cannot find content');
    }

    const reviewStar = await this.prisma.review.aggregate({
      _sum: {
        starRating: true,
      },
      where: {
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
    });

    return ContentEntity.createEntity(content, reviewStar._sum.starRating || 0);
  };

  public getContentAll: (
    pagenation: ContentPagerbleDto,
    userIdx: number,
  ) => Promise<{
    contentList: SummaryContentEntity[];
    count: number;
  }> = async (pagerble, userIdx) => {
    const where: Prisma.CultureContentWhereInput = {
      genreIdx: pagerble.genre || undefined,
      ageIdx: pagerble.age || undefined,
      Style: pagerble.style
        ? {
            some: {
              Style: {
                deletedAt: null,
              },
            },
          }
        : undefined,
      Location: pagerble.region
        ? {
            hCode: pagerble.region,
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
        deletedAt: null,
        blockedAt: null,
      },
    };

    const [count, contentList] = await this.prisma.$transaction([
      this.prisma.cultureContent.count({ where }),
      this.prisma.cultureContent.findMany({
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
              userIdx,
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
        where,
        orderBy: {
          [pagerble.orderby === 'time' ? 'idx' : 'likeCount']: pagerble.order,
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
    ]);

    return {
      contentList: contentList.map((content) =>
        SummaryContentEntity.createEntity(content),
      ),
      count: count,
    };
  };

  public async getSoonOpenContentAll(
    userIdx: number,
  ): Promise<SummaryContentEntity[]> {
    const contentList = await this.prisma.cultureContent.findMany({
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
            userIdx,
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

    return contentList.map((content) =>
      SummaryContentEntity.createEntity(content),
    );
  }

  public async getSoonEndContentAll(
    userIdx: number,
  ): Promise<SummaryContentEntity[]> {
    const contentList = await this.prisma.cultureContent.findMany({
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
            userIdx,
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

    return contentList.map((content) =>
      SummaryContentEntity.createEntity(content),
    );
  }

  // Content Request ==========================================

  /**
   * Get culture-content request by idx with author
   */
  public getContentRequestByIdx: (idx: number) => Promise<ContentEntity> =
    async (idx) => {
      const content = await this.prisma.cultureContent.findUnique({
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
              userIdx: -1,
            },
          },
          _count: {
            select: {
              Review: true,
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

      if (!content) {
        throw new ContentNotFoundException(
          'Cannot find culture content request',
        );
      }

      const starRatingSum = await this.prisma.review.aggregate({
        where: {
          deletedAt: null,
          User: {
            deletedAt: null,
          },
        },
        _sum: {
          starRating: true,
        },
      });

      return ContentEntity.createEntity(
        content,
        starRatingSum._sum.starRating || 0,
      );
    };

  /**
   * Create culture-content request
   */
  public createContentRequest: (
    userIdx: number,
    createDto: CreateContentRequestDto,
  ) => Promise<number> = async (userIdx, createDto) => {
    await this.uploadService.checkExistFiles(
      createDto.imgList.map((file) => file.filePath),
      FILE_GROUPING.CULTURE_CONTENT,
      userIdx,
    );

    return await this.prisma.$transaction(async (tx) => {
      const createdLocation = await tx.location.create({
        data: {
          address: createDto.location.address,
          detailAddress: createDto.location.detailAddress,
          region1Depth: createDto.location.region1Depth,
          region2Depth: createDto.location.region2Depth,
          hCode: createDto.location.hCode,
          bCode: createDto.location.bCode,
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
                    imgPath: img.filePath,
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
  };

  /**
   * Update culture-content request by idx
   */
  public updateContentRequest: (
    idx: number,
    updateDto: UpdateContentDto,
    userIdx: number,
  ) => Promise<void> = async (idx, updateDto, userIdx) => {
    await this.uploadService.checkExistFiles(
      updateDto.imgList.map((file) => file.filePath),
      FILE_GROUPING.CULTURE_CONTENT,
      userIdx,
    );

    await this.prisma.$transaction([
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
                    imgPath: img.filePath,
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

    return;
  };

  /**
   * Delete culture-content request
   */
  public deleteContentRequest: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.cultureContent.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  };

  /**
   * Add like culture-content by idx
   */
  public likeContent: (userIdx: number, contentIdx: number) => Promise<void> =
    async (userIdx, contentIdx) => {
      const likeState = await this.prisma.contentLike.findUnique({
        where: {
          contentIdx_userIdx: {
            userIdx,
            contentIdx,
          },
        },
      });

      if (likeState) {
        throw new AlreadyLikeContentException('Already liked culture content');
      }

      await this.prisma.$transaction([
        this.prisma.cultureContent.update({
          where: {
            idx: contentIdx,
          },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        }),
        this.prisma.contentLike.create({
          data: {
            contentIdx,
            userIdx,
          },
        }),
      ]);

      return;
    };

  /**
   * Cancel to like culture-content by idx
   */
  public cancelToLikeContent: (
    userIdx: number,
    contentIdx: number,
  ) => Promise<void> = async (userIdx, contentIdx) => {
    const likeState = await this.prisma.contentLike.findUnique({
      where: {
        contentIdx_userIdx: {
          userIdx,
          contentIdx,
        },
      },
    });

    if (!likeState) {
      throw new AlreadyNotLikeContentException(
        'Already do not like culture content',
      );
    }

    await this.prisma.$transaction([
      this.prisma.cultureContent.update({
        where: {
          idx: contentIdx,
        },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      }),
      this.prisma.contentLike.delete({
        where: {
          contentIdx_userIdx: {
            userIdx,
            contentIdx,
          },
        },
      }),
    ]);

    return;
  };
}
