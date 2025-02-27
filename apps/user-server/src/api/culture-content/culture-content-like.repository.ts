import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { LikeContentPagerbleDto } from './dto/like-content-pagerble.dto';
import { PrismaProvider } from 'libs/modules';
import { SelectLikedContentFieldPrisma } from 'apps/user-server/src/api/culture-content/entity/prisma/select-liked-content-field';
import { ContentLike } from '@prisma/client';

@Injectable()
export class CultureContentLikeRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    @Logger(CultureContentLikeRepository.name)
    private readonly logger: LoggerService,
  ) {}

  /**
   * @author jochongs
   */
  public async selectCultureContentLike(
    userIdx: number,
    contentIdx: number,
  ): Promise<ContentLike | null> {
    this.logger.log(
      this.selectCultureContentLike,
      'SELECT culture content like',
    );
    return await this.prisma.contentLike.findUnique({
      where: {
        contentIdx_userIdx: {
          userIdx,
          contentIdx,
        },
      },
    });
  }

  /**
   * @author jochongs
   */
  public async increaseCultureContentLike(
    userIdx: number,
    contentIdx: number,
  ): Promise<void> {
    this.logger.log(
      this.increaseCultureContentLike,
      'UPDATE content like count, INSERT culture content like',
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
  }

  /**
   * @author jochongs
   */
  public async decreaseCultureContentLike(
    userIdx: number,
    contentIdx: number,
  ): Promise<void> {
    this.logger.log(
      this.decreaseCultureContentLike,
      'UPDATE content like count, DELETE culture content like',
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
  }

  /**
   * @author jochongs
   */
  public async selectLikeContentAll(
    userIdx: number,
    pagerble: LikeContentPagerbleDto,
  ): Promise<SelectLikedContentFieldPrisma[]> {
    return await this.prisma.contentLike.findMany({
      select: {
        CultureContent: {
          select: {
            idx: true,
            title: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            acceptedAt: true,
            User: {
              select: {
                idx: true,
              },
            },
            ContentImg: {
              select: {
                imgPath: true,
              },
              where: {
                deletedAt: null,
              },
              orderBy: {
                idx: 'asc',
              },
            },
            Genre: {
              select: {
                idx: true,
                name: true,
              },
            },
            Style: {
              select: {
                Style: {
                  select: {
                    idx: true,
                    name: true,
                  },
                },
              },
              where: {
                Style: {
                  deletedAt: null,
                },
              },
            },
            Age: {
              select: {
                idx: true,
                name: true,
              },
            },
            Location: {
              select: {
                region1Depth: true,
                region2Depth: true,
                detailAddress: true,
                address: true,
                positionX: true,
                positionY: true,
                hCode: true,
                bCode: true,
              },
            },
          },
        },
      },
      where: {
        userIdx,
        CultureContent: {
          deletedAt: null,
          acceptedAt: {
            not: null,
          },
          genreIdx: pagerble.genre,
          startDate: pagerble.onlyopen
            ? {
                lte: new Date(),
              }
            : undefined,
          endDate: pagerble.onlyopen
            ? {
                gte: new Date(),
              }
            : undefined,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
      skip: (pagerble.page - 1) * 12,
    });
  }
}
