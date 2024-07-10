import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { ContentNotFoundException } from './exception/ContentNotFound';
import { AlreadyLikeContentException } from './exception/AlreadyLikeContentException';
import { AlreadyNotLikeContentException } from './exception/AlreadyNotLikeContentException';
import { ContentEntity } from './entity/content.entity';
import { SummaryContentEntity } from './entity/summary-content.entity';
import { Prisma } from '@prisma/client';
import { LoginUser } from '../auth/model/login-user';
import { HotCultureContentEntity } from './entity/hot-content.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class CultureContentService {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(CultureContentService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 컨텐츠 자세히보기
   */
  public async getContentByIdx(
    idx: number,
    userIdx?: number,
  ): Promise<ContentEntity> {
    this.logger.log(this.getContentByIdx, `SELECT content ${idx}`);
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

    if (!content) {
      this.logger.warn(
        this.getContentByIdx,
        `Attempt to not found content | content = ${idx}`,
      );
      throw new ContentNotFoundException('Cannot find content');
    }

    this.logger.log(
      this.getContentByIdx,
      `SELECT review count | content = ${idx}`,
    );
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
  }

  /**
   * 컨텐츠 목록 보기
   */
  public async getContentAll(
    pagerble: ContentPagerbleDto,
    userIdx?: number,
  ): Promise<{
    contentList: SummaryContentEntity[];
    count: number;
  }> {
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

    this.logger.log(this.getContentAll, 'SELECT content and count');
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
              userIdx: userIdx || -1,
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
  }

  /**
   * 곧 오픈하는 컨텐츠 목록 보기
   */
  public async getSoonOpenContentAll(
    userIdx?: number,
  ): Promise<SummaryContentEntity[]> {
    this.logger.log(this.getSoonOpenContentAll, 'SELECT culture contents');
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

    return contentList.map((content) =>
      SummaryContentEntity.createEntity(content),
    );
  }

  /**
   * 곧 종료하는 컨텐츠 목록 보기
   */
  public async getSoonEndContentAll(
    userIdx?: number,
  ): Promise<SummaryContentEntity[]> {
    this.logger.log(this.getSoonEndContentAll, 'SELECT culture contents');
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

    return contentList.map((content) =>
      SummaryContentEntity.createEntity(content),
    );
  }

  /**
   * 인기 컨텐츠 전부 보기
   */
  public async getHotContentAll() {
    this.logger.log(this.getHotContentAll, 'SELECT culture contents');
    const genre = await this.prisma.genre.findMany({
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
    });

    return genre.map((genre) =>
      HotCultureContentEntity.createHotContent(genre),
    );
  }

  /**
   * 인기 연령대 컨텐츠 목록 보기
   */
  public async getHotContentByAge(
    ageIdx?: number,
    loginUser?: LoginUser,
  ): Promise<SummaryContentEntity[]> {
    this.logger.log(this.getHotContentAll, 'SELECT culture contents');
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
            userIdx: loginUser?.idx || -1,
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

    return contentList.map((content) =>
      SummaryContentEntity.createEntity(content),
    );
  }

  /**
   * 문화생활컨텐츠 생성하기
   */
  public async createContentRequest(
    userIdx: number,
    createDto: CreateContentRequestDto,
  ): Promise<number> {
    this.logger.log(this.createContentRequest, 'INSERT culture contents');
    return this.prisma.$transaction(async (tx) => {
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

  public async updateContentRequest(
    idx: number,
    updateDto: UpdateContentDto,
    userIdx: number,
  ): Promise<void> {
    this.logger.log(
      this.updateContentRequest,
      `UPDATE culture content | content = ${idx}`,
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

    return;
  }

  public async deleteContentRequest(idx: number): Promise<void> {
    this.logger.log(
      this.deleteContentRequest,
      `DELETE culture content | content = ${idx}`,
    );
    await this.prisma.cultureContent.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  }

  public async likeContent(userIdx: number, contentIdx: number) {
    this.logger.log(this.likeContent, 'SELECT content like');
    const likeState = await this.prisma.contentLike.findUnique({
      where: {
        contentIdx_userIdx: {
          userIdx,
          contentIdx,
        },
      },
    });

    if (likeState) {
      this.logger.warn(
        this.likeContent,
        'Attempt to like to already liked content',
      );
      throw new AlreadyLikeContentException('Already liked culture content');
    }

    this.logger.log(
      this.likeContent,
      'INSERT content like and UPDATE content like count',
    );
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
  }

  public async cancelToLikeContent(
    userIdx: number,
    contentIdx: number,
  ): Promise<void> {
    this.logger.log(this.likeContent, 'SELECT content like');
    const likeState = await this.prisma.contentLike.findUnique({
      where: {
        contentIdx_userIdx: {
          userIdx,
          contentIdx,
        },
      },
    });

    if (!likeState) {
      this.logger.warn(
        this.likeContent,
        'Attempt to cancel to like non-liked content',
      );
      throw new AlreadyNotLikeContentException(
        'Already do not like culture content',
      );
    }

    this.logger.log(
      this.likeContent,
      'DELETE content like and UPDATE content like count',
    );
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
  }
}
