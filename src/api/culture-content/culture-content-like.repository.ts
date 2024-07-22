import { PrismaService } from '../../common/module/prisma/prisma.service';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CultureContentLikeRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(CultureContentLikeRepository.name)
    private readonly logger: LoggerService,
  ) {}

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

  public increaseCultureContentLike(userIdx: number, contentIdx: number) {
    this.logger.log(
      this.increaseCultureContentLike,
      'UPDATE content like count, INSERT culture content like',
    );
    return this.prisma.$transaction([
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

  public decreaseCultureContentLike(userIdx: number, contentIdx: number) {
    this.logger.log(
      this.decreaseCultureContentLike,
      'UPDATE content like count, DELETE culture content like',
    );
    return this.prisma.$transaction([
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
}
