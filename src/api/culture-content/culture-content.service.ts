import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContentRequestDto } from './dto/CreateContentRequestDto';
import { UpdateContentDto } from './dto/UpdateContentDto';
import { ContentListPagenationDto } from './dto/ContentListPagenationDto';
import { ContentEntity } from './entity/ContentEntity';
import { ContentNotFoundException } from './exception/ContentNotFound';
import { AlreadyLikeContentException } from './exception/AlreadyLikeContentException';
import { AlreadyNotLikeContentException } from './exception/AlreadyNotLikeContentException';
import { GetMyCultureContentPagerble } from '../user/dto/GetMyCultureContentPagerble';
import { UploadService } from '../upload/upload.service';
import { FILE_GROUPING } from '../upload/file-grouping';

@Injectable()
export class CultureContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  // Content ==================================================

  /**
   * Get detail culture-content for user
   */
  public getContentByIdx: (
    idx: number,
    userIdx: number,
  ) => Promise<ContentEntity<'detail'>> = async (idx, userIdx) => {
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

    return ContentEntity.createUserDetailContent(
      content,
      reviewStar._sum.starRating || 0,
    );
  };

  /**
   * Get all culture-contents for user
   */
  public getContentAll: (
    pagenation: ContentListPagenationDto,
    userIdx: number,
  ) => Promise<{
    contentList: ContentEntity<'summary'>[];
    count: number;
  }> = async (pagenation, userIdx) => {
    const [count, contentList] = await this.prisma.$transaction([
      this.prisma.cultureContent.count({
        where: {
          genreIdx: pagenation.genre || undefined,
          ageIdx: pagenation.age || undefined,
          Style: pagenation.style
            ? {
                some: {
                  Style: {
                    deletedAt: null,
                  },
                },
              }
            : undefined,
          Location: pagenation.region
            ? {
                hCode: pagenation.region,
              }
            : undefined,
          startDate: pagenation.open
            ? {
                lte: new Date(),
              }
            : undefined,
          endDate: pagenation.open
            ? {
                gte: new Date(),
              }
            : undefined,
          acceptedAt: {
            not: null,
          },
          deletedAt: null,
          User: {
            deletedAt: null,
            blockedAt: null,
          },
        },
      }),
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
        where: {
          genreIdx: pagenation.genre || undefined,
          ageIdx: pagenation.age || undefined,
          Style: pagenation.style
            ? {
                some: {
                  Style: {
                    deletedAt: null,
                  },
                },
              }
            : undefined,
          Location: pagenation.region
            ? {
                hCode: pagenation.region,
              }
            : undefined,
          startDate: pagenation.open
            ? {
                lte: new Date(),
              }
            : undefined,
          endDate: pagenation.open
            ? {
                gte: new Date(),
              }
            : undefined,
          acceptedAt: {
            not: null,
          },
          deletedAt: null,
          User: {
            deletedAt: null,
            blockedAt: null,
          },
        },
        orderBy: {
          [pagenation.orderby === 'time' ? 'idx' : 'likeCount']:
            pagenation.order,
        },
        take: 10,
        skip: (pagenation.page - 1) * 10,
      }),
    ]);

    return {
      contentList: contentList.map((content) =>
        ContentEntity.createUserSummaryContent(content),
      ),
      count: count,
    };
  };

  /**
   * Get all culture-contents by user idx
   */
  public async getContentByUserIdx(
    userIdx: number,
    pagerble: GetMyCultureContentPagerble,
  ): Promise<{
    contentList: ContentEntity<'summary'>[];
    count: number;
  }> {
    const [count, contentList] = await this.prisma.$transaction([
      this.prisma.cultureContent.count({
        where: {
          userIdx,
          deletedAt: null,
        },
      }),
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
        where: {
          userIdx,
          deletedAt: null,
        },
        orderBy: {
          idx: 'desc',
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
    ]);

    return {
      contentList: contentList.map((content) =>
        ContentEntity.createUserSummaryContent(content),
      ),
      count,
    };
  }

  /**
   * Get all culture-contents that is opening soon
   */
  public async getSoonOpenContentAll(
    userIdx: number,
  ): Promise<ContentEntity<'summary'>[]> {
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
      ContentEntity.createUserSummaryContent(content),
    );
  }

  /**
   * Get all culture-contents that is about to end
   */
  public async getSoonEndContentAll(
    userIdx: number,
  ): Promise<ContentEntity<'summary'>[]> {
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
      ContentEntity.createUserSummaryContent(content),
    );
  }

  // Content Request ==========================================

  /**
   * Get culture-content request by idx with author
   */
  public getContentRequestByIdx: (
    idx: number,
  ) => Promise<ContentEntity<'detail', 'author'>> = async (idx) => {
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
      throw new ContentNotFoundException('Cannot find culture content request');
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

    return ContentEntity.createSummaryContentWithAuthor(
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
