import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ReviewEntity } from './entity/ReviewEntity';
import { ReviewListPagerbleDto } from './dto/ReviewListPagerbleDto';
import { ReviewListByContentPagerbleDto } from './dto/ReviewListByContentPagerbleDto';
import { UpdateReviewDto } from './dto/UpdateReviewDto';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { ReviewNotFoundException } from './exception/ReviewNotFoundException';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}
  // User ======================================================

  /**
   * 컨텐츠별 리뷰 목록 보기
   */
  public getReviewAll: (
    contentIdx: number,
    userIdx: number,
    pagerble: ReviewListByContentPagerbleDto,
  ) => Promise<{
    reviewList: ReviewEntity<'detail', 'user'>[];
    count: number;
  }> = async (contentIdx, userIdx, pagerble) => {
    const [count, reviewList] = await this.prisma.$transaction([
      this.prisma.review.count({
        where: {
          cultureContentIdx: contentIdx,
          deletedAt: null,
          User: {
            deletedAt: null,
          },
          CultureContent: {
            deletedAt: null,
            acceptedAt: {
              not: null,
            },
            User: {
              deletedAt: null,
            },
          },
        },
      }),
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
              userIdx,
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
          cultureContentIdx: contentIdx,
          deletedAt: null,
          User: {
            deletedAt: null,
          },
          CultureContent: {
            deletedAt: null,
            acceptedAt: {
              not: null,
            },
            User: {
              deletedAt: null,
            },
          },
        },
        orderBy: {
          idx: pagerble.order,
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
    ]);

    return {
      count,
      reviewList: reviewList.map((review) =>
        ReviewEntity.createDetailUserReviewEntity(review),
      ),
    };
  };

  /**
   * 리뷰 자세히보기
   */
  public getReviewByIdx: (
    idx: number,
    userIdx: number,
  ) => Promise<ReviewEntity<'detail', 'user'>> = async (reviewIdx, userIdx) => {
    const review = await this.prisma.review.findUnique({
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
            userIdx,
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
        idx: reviewIdx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
        CultureContent: {
          deletedAt: null,
          acceptedAt: {
            not: null,
          },
          User: {
            deletedAt: null,
          },
        },
      },
    });

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    return ReviewEntity.createDetailUserReviewEntity(review);
  };

  /**
   * 리뷰 생성하기
   */
  public createReview: (
    contentIdx: number,
    userIdx: number,
    createDto: CreateReviewDto,
  ) => Promise<number>;

  /**
   * 리뷰 수정하기
   */
  public updateReview: (
    idx: number,
    updateDto: UpdateReviewDto,
  ) => Promise<void>;

  // Admin =====================================================

  /**
   * 관리자용 리뷰 전체 가져오기
   */
  public getReviewAllForAdmin: (pagerble: ReviewListPagerbleDto) => Promise<{
    reviewList: ReviewEntity<'summary', 'admin'>;
    count: number;
  }>;

  /**
   * 관리자용 리뷰 하나 가져오기
   */
  public getReviewByIdxForAdmin: (
    idx: number,
  ) => Promise<ReviewEntity<'detail', 'admin'>>;

  // Like ======================================================

  /**
   * 리뷰 좋아요 누르기
   */
  public likeReview: (userIdx: number, reviewIdx: number) => Promise<void>;

  /**
   * 리뷰 좋아요 취소하기
   */
  public cancelToLikeReview: (
    userIdx: number,
    reviewIdx: number,
  ) => Promise<void>;
}
