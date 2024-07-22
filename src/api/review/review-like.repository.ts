import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class ReviewLikeRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(ReviewLikeRepository.name) private readonly logger: LoggerService,
  ) {}

  public selectReviewLike(userIdx: number, reviewIdx: number) {
    this.logger.log(this.selectReviewLike, 'SELECT review like');
    return this.prisma.reviewLike.findUnique({
      where: {
        reviewIdx_userIdx: {
          reviewIdx,
          userIdx,
        },
      },
    });
  }

  public increaseReviewLike(userIdx: number, reviewIdx: number) {
    this.logger.log(this.increaseReviewLike, 'UPDATE review like +1');
    return this.prisma.$transaction([
      this.prisma.reviewLike.create({
        data: {
          reviewIdx,
          userIdx,
        },
      }),
      this.prisma.review.update({
        where: {
          idx: reviewIdx,
        },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      }),
    ]);
  }

  public decreaseReviewLike(userIdx: number, reviewIdx: number) {
    this.logger.log(this.increaseReviewLike, 'UPDATE review like -1');
    return this.prisma.$transaction([
      this.prisma.reviewLike.delete({
        where: {
          reviewIdx_userIdx: {
            reviewIdx,
            userIdx,
          },
        },
      }),
      this.prisma.review.update({
        where: {
          idx: reviewIdx,
        },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      }),
    ]);
  }
}
