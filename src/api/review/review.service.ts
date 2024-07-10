import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { ReviewPagerbleDto } from './dto/review-pagerble.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ContentNotFoundException } from '../culture-content/exception/ContentNotFound';
import { AlreadyLikeReviewException } from './exception/AlreadyLikeReviewException';
import { AlreadyNotLikeReviewExcpetion } from './exception/AlreadyNotLikeReviewException';
import { ReviewEntity } from './entity/review.entity';
import { Prisma } from '@prisma/client';
import { LoginUser } from '../auth/model/login-user';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(ReviewService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 리뷰 목록 보기
   */
  public async getReviewAll(
    pagerble: ReviewPagerbleDto,
    userIdx?: number,
  ): Promise<{
    reviewList: ReviewEntity[];
    count: number;
  }> {
    const where: Prisma.ReviewWhereInput = {
      cultureContentIdx: pagerble.content,
      userIdx: pagerble.user,
      deletedAt: null,
      User: {
        deletedAt: null,
      },
    };

    this.logger.log(this.getReviewAll, 'SELECT review and count');
    const [count, reviewList] = await this.prisma.$transaction([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        include: {
          ReviewImg: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              idx: 'asc',
            },
          },
          ReviewLike: {
            where: {
              userIdx: userIdx || -1,
            },
          },
          User: true,
          CultureContent: {
            include: {
              User: true,
              ContentImg: true,
              Genre: true,
              Style: {
                include: {
                  Style: true,
                },
              },
              Age: true,
              Location: true,
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
      count,
      reviewList: reviewList.map((review) => ReviewEntity.createEntity(review)),
    };
  }

  /**
   * 인기 리뷰 가져오기
   */
  public async getHotReviewAll(loginUser?: LoginUser): Promise<ReviewEntity[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    this.logger.log(this.getHotReviewAll, 'SELECT reviews');
    const reviewList = await this.prisma.review.findMany({
      include: {
        ReviewImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        ReviewLike: {
          where: {
            userIdx: loginUser?.idx || -1,
          },
        },
        User: true,
        CultureContent: {
          include: {
            User: true,
            ContentImg: true,
            Genre: true,
            Style: {
              include: {
                Style: true,
              },
            },
            Age: true,
            Location: true,
          },
        },
      },
      where: {
        deletedAt: null,
        CultureContent: {
          deletedAt: null,
          User: {
            blockedAt: null,
            deletedAt: null,
          },
          acceptedAt: {
            not: null,
          },
        },
        User: {
          deletedAt: null,
        },
        createdAt: {
          gte: sevenDaysAgo,
        },
        likeCount: {
          gte: 3,
        },
      },
      orderBy: {
        likeCount: 'desc',
      },
      take: 5,
    });

    return reviewList.map((review) => ReviewEntity.createEntity(review));
  }

  /**
   * 리뷰 생성하기
   */
  public async createReview(
    contentIdx: number,
    userIdx: number,
    createDto: CreateReviewDto,
  ): Promise<void> {
    this.logger.log(this.createReview, `SELECT culture content ${contentIdx}`);
    const content = await this.prisma.cultureContent.findUnique({
      where: {
        idx: contentIdx,
        deletedAt: null,
        acceptedAt: {
          not: null,
        },
        User: {
          deletedAt: null,
          blockedAt: null,
        },
      },
    });

    if (!content) {
      this.logger.warn(
        this.createReview,
        `Attempt to create review with non-existent content ${contentIdx}`,
      );
      throw new ContentNotFoundException('Cannot find content');
    }

    if (!content.acceptedAt) {
      this.logger.warn(
        this.createReview,
        `Attempt to create review with not accepted content ${contentIdx}`,
      );
      throw new ContentNotFoundException('Cannot find content');
    }

    this.logger.log(this.createReview, 'INSERT review');
    await this.prisma.review.create({
      data: {
        userIdx: userIdx,
        cultureContentIdx: content.idx,
        starRating: createDto.starRating,
        description: createDto.description,
        ReviewImg: {
          createMany: {
            data: createDto.imgList.map((img) => ({
              imgPath: img,
            })),
          },
        },
        visitTime: new Date(createDto.visitTime),
      },
    });

    return;
  }

  /**
   * 리뷰 수정하기
   */
  public async updateReview(
    idx: number,
    updateDto: UpdateReviewDto,
  ): Promise<void> {
    this.logger.log(this.updateReview, `UPDATE review ${idx}`);
    await this.prisma.review.update({
      where: {
        idx,
      },
      data: {
        starRating: updateDto.starRating,
        description: updateDto.description,
        ReviewImg: {
          updateMany: {
            where: {},
            data: {
              deletedAt: new Date(),
            },
          },
          createMany: {
            data: updateDto.imgList.map((img) => ({
              imgPath: img,
            })),
          },
        },
        visitTime: new Date(updateDto.visitTime),
      },
    });
  }

  /**
   * 리뷰 삭제하기
   */
  public async deleteReview(idx: number): Promise<void> {
    this.logger.log(this.deleteReview, `DELETE review ${idx}`);
    await this.prisma.review.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  }

  /**
   * 리뷰 좋아요 누르기
   */
  public async likeReview(userIdx: number, reviewIdx: number): Promise<void> {
    this.logger.log(this.likeReview, 'SELECT review like');
    const reviewLike = await this.prisma.reviewLike.findUnique({
      where: {
        reviewIdx_userIdx: {
          reviewIdx,
          userIdx,
        },
      },
    });

    if (reviewLike) {
      this.logger.warn(this.likeReview, 'Attempt to like already liked review');
      throw new AlreadyLikeReviewException('Already like review');
    }

    this.logger.log(
      this.likeReview,
      'INSERT review like and UPDATE review like count',
    );
    await this.prisma.$transaction([
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

    return;
  }

  /**
   * 좋아요 취소하기
   */
  public async cancelToLikeReview(
    userIdx: number,
    reviewIdx: number,
  ): Promise<void> {
    this.logger.log(this.cancelToLikeReview, 'SELECT review like');
    const reviewLike = await this.prisma.reviewLike.findUnique({
      where: {
        reviewIdx_userIdx: {
          reviewIdx,
          userIdx,
        },
      },
    });

    if (!reviewLike) {
      this.logger.log(
        this.cancelToLikeReview,
        `Attempt to cancel to like non liked review ${reviewIdx}`,
      );
      throw new AlreadyNotLikeReviewExcpetion('Already do not like review');
    }

    this.logger.log(
      this.cancelToLikeReview,
      'DELETE review like AND UPDATE review like count',
    );
    await this.prisma.$transaction([
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

    return;
  }
}
