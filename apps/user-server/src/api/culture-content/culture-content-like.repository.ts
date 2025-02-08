import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { LikeContentPagerbleDto } from './dto/like-content-pagerble.dto';
import { PrismaProvider } from 'libs/modules';

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
  public selectCultureContentLike(userIdx: number, contentIdx: number) {
    this.logger.log(
      this.selectCultureContentLike,
      'SELECT culture content like',
    );
    return this.prisma.contentLike.findUnique({
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
  public selectLikeContentAll(
    userIdx: number,
    pagerble: LikeContentPagerbleDto,
  ) {
    return this.prisma.contentLike.findMany({
      include: {
        CultureContent: {
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
