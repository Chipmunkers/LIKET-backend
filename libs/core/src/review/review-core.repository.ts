import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { FindReviewAllInput } from 'libs/core/review/input/find-review-all.input';
import { ReviewSelectField } from 'libs/core/review/model/prisma/review-select-field';
import { PrismaProvider } from 'libs/modules';
import { Prisma } from '@prisma/client';
import { CreateReviewInput } from 'libs/core/review/input/create-review.input';
import { UpdateReviewInput } from 'libs/core/review/input/update-review.input';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT review WHERE idx = $1
   *
   * @author jochongs
   */
  public async selectReviewByIdx(
    idx: number,
    readUser?: number,
  ): Promise<ReviewSelectField | null> {
    return await this.txHost.tx.review.findUnique({
      select: {
        idx: true,
        description: true,
        reportCount: true,
        likeCount: true,
        createdAt: true,
        starRating: true,
        visitTime: true,
        User: {
          select: {
            idx: true,
            profileImgPath: true,
            isAdmin: true,
            provider: true,
            nickname: true,
          },
        },
        ReviewImg: {
          select: {
            idx: true,
            imgPath: true,
            createdAt: true,
          },
          where: { deletedAt: null },
        },
        ReviewLike: {
          select: { userIdx: true },
          where: { userIdx: readUser || -1 },
        },
        CultureContent: {
          select: {
            idx: true,
            title: true,
            likeCount: true,
            User: {
              select: {
                idx: true,
                nickname: true,
                email: true,
                profileImgPath: true,
                isAdmin: true,
              },
            },
            ContentImg: {
              select: {
                idx: true,
                imgPath: true,
                createdAt: true,
              },
              where: { deletedAt: null },
              orderBy: {
                idx: 'asc',
              },
            },
            Genre: {
              select: {
                idx: true,
                name: true,
                createdAt: true,
              },
            },
          },
        },
      },
      where: { idx, deletedAt: null, User: { deletedAt: null } },
    });
  }

  /**
   * SELECT review
   *
   * @author jochongs
   */
  public async selectReviewAll(
    {
      page,
      row,
      userIdx,
      cultureContentIdx,
      order = 'desc',
      orderBy = 'time',
      withOutReviewList = [],
      searchByList = [],
      isOnlyAcceptedCultureContent,
      isOnlyOpenCultureContent,
      isLiketCreated,
      searchKeyword,
    }: FindReviewAllInput,
    readUser?: number,
  ): Promise<ReviewSelectField[]> {
    return await this.txHost.tx.review.findMany({
      select: {
        idx: true,
        description: true,
        reportCount: true,
        likeCount: true,
        createdAt: true,
        starRating: true,
        visitTime: true,
        User: {
          select: {
            idx: true,
            profileImgPath: true,
            isAdmin: true,
            provider: true,
            nickname: true,
          },
        },
        ReviewImg: {
          select: {
            idx: true,
            imgPath: true,
            createdAt: true,
          },
          where: { deletedAt: null },
        },
        ReviewLike: {
          select: { userIdx: true },
          where: { userIdx: readUser || -1 },
        },
        CultureContent: {
          select: {
            idx: true,
            title: true,
            likeCount: true,
            User: {
              select: {
                idx: true,
                nickname: true,
                email: true,
                profileImgPath: true,
                isAdmin: true,
              },
            },
            ContentImg: {
              select: {
                idx: true,
                imgPath: true,
                createdAt: true,
              },
              where: { deletedAt: null },
              orderBy: {
                idx: 'asc',
              },
            },
            Genre: {
              select: {
                idx: true,
                name: true,
                createdAt: true,
              },
            },
          },
        },
      },
      where: {
        deletedAt: null,
        CultureContent: { deletedAt: null },
        User: { deletedAt: null, blockedAt: null },
        ReviewReport: readUser
          ? {
              none: { reportUserIdx: readUser },
            }
          : undefined,
        AND: [
          this.getSearchWhereClause(searchByList, searchKeyword),
          this.getCultureContentWhereClause(cultureContentIdx),
          this.getUserWhereClause(userIdx),
          this.getIsLikeCreatedReviewOnlyWhereClause(isLiketCreated),
          this.getWithOutReviewListWhereClause(withOutReviewList),
          this.getIsOnlyAcceptCultureContentWhereClause(
            isOnlyAcceptedCultureContent,
          ),
          this.getIsOnlyOpenCultureContentWhereClause(isOnlyOpenCultureContent),
        ],
      },
      take: row,
      skip: (page - 1) * row,
      orderBy: {
        [this.getOrderByFieldName(orderBy)]: order,
      },
    });
  }

  /**
   * 정렬 순서를 가져오는 메서드
   *
   * @author jochongs
   */
  private getOrderByFieldName(orderBy: 'time' | 'like'): 'likeCount' | 'idx' {
    if (orderBy === 'time') {
      return 'idx';
    }

    return 'likeCount';
  }

  /**
   * 검색 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getSearchWhereClause(
    searchByList: ('content' | 'user')[],
    searchKeyword?: string,
  ): Prisma.ReviewWhereInput {
    if (searchByList.length === 0) return {};

    if (!searchKeyword) return {};

    return {
      AND: [
        searchByList.includes('content')
          ? {
              CultureContent: {
                title: {
                  contains: searchKeyword,
                },
              },
            }
          : {},
        searchByList.includes('user')
          ? {
              User: {
                nickname: {
                  contains: searchKeyword,
                },
              },
            }
          : {},
      ],
    };
  }

  /**
   * 문화생활컨텐츠 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getCultureContentWhereClause(idx?: number): Prisma.ReviewWhereInput {
    if (!idx) return {};

    return {
      cultureContentIdx: idx,
    };
  }

  /**
   * 라이켓 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getIsLikeCreatedReviewOnlyWhereClause(
    isLiketCreated?: boolean,
  ): Prisma.ReviewWhereInput {
    if (isLiketCreated === undefined) return {};

    return {
      Liket: {
        some: isLiketCreated
          ? {
              deletedAt: null,
            }
          : undefined,
        none: !isLiketCreated
          ? {
              deletedAt: null,
            }
          : undefined,
      },
    };
  }

  /**
   * 리뷰 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getWithOutReviewListWhereClause(
    withOutReviewList: number[],
  ): Prisma.ReviewWhereInput {
    if (!withOutReviewList.length) return {};

    return {
      idx: {
        notIn: withOutReviewList,
      },
    };
  }

  /**
   * 사용자 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getUserWhereClause(idx?: number): Prisma.ReviewWhereInput {
    if (!idx) return {};

    return {
      userIdx: idx,
    };
  }

  /**
   * 활성화된 컨텐츠 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getIsOnlyAcceptCultureContentWhereClause(
    isOnly?: boolean,
  ): Prisma.ReviewWhereInput {
    if (isOnly === undefined) return {};

    return {
      CultureContent: {
        acceptedAt: isOnly ? { not: null } : null,
      },
    };
  }

  /**
   * 오픈된 컨텐츠 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getIsOnlyOpenCultureContentWhereClause(
    isOnly?: boolean,
  ): Prisma.ReviewWhereInput {
    if (isOnly === undefined) return {};

    const now = new Date();

    if (isOnly) {
      return {
        NOT: {
          CultureContent: {
            startDate: { lte: now },
            OR: [{ endDate: { gte: now } }, { endDate: null }],
          },
        },
      };
    }

    return {
      CultureContent: {
        startDate: { lte: now },
        OR: [{ endDate: { gte: now } }, { endDate: null }],
      },
    };
  }

  /**
   * INSERT review
   *
   * @author jochongs
   *
   * @param input 생성할 리뷰 정보
   * @param userIdx 작성자 식별자
   * @param cultureContentIdx 연결된 문화생활컨텐츠 식별자
   */
  public async insertReview(
    input: CreateReviewInput,
    userIdx: number,
    cultureContentIdx: number,
  ): Promise<ReviewSelectField> {
    return await this.txHost.tx.review.create({
      select: {
        idx: true,
        description: true,
        reportCount: true,
        likeCount: true,
        createdAt: true,
        starRating: true,
        visitTime: true,
        User: {
          select: {
            idx: true,
            profileImgPath: true,
            isAdmin: true,
            provider: true,
            nickname: true,
          },
        },
        ReviewImg: {
          select: {
            idx: true,
            imgPath: true,
            createdAt: true,
          },
          where: { deletedAt: null },
        },
        ReviewLike: {
          select: { userIdx: true },
          where: { userIdx: -1 },
        },
        CultureContent: {
          select: {
            idx: true,
            title: true,
            likeCount: true,
            User: {
              select: {
                idx: true,
                nickname: true,
                email: true,
                profileImgPath: true,
                isAdmin: true,
              },
            },
            ContentImg: {
              select: {
                idx: true,
                imgPath: true,
                createdAt: true,
              },
              where: { deletedAt: null },
              orderBy: {
                idx: 'asc',
              },
            },
            Genre: {
              select: {
                idx: true,
                name: true,
                createdAt: true,
              },
            },
          },
        },
      },
      data: {
        cultureContentIdx,
        userIdx,
        starRating: input.starRating,
        visitTime: input.visitTime,
        ReviewImg: {
          createMany: {
            data: input.imgList.map((imgPath) => ({ imgPath })),
          },
        },
        description: input.description,
      },
    });
  }

  /**
   * UPDATE review WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 수정할 리뷰 식별자
   * @param input 수정할 리뷰 정보
   */
  public async updateReviewByIdx(
    idx: number,
    input: UpdateReviewInput,
  ): Promise<void> {
    await this.txHost.tx.review.update({
      where: { idx, deletedAt: null, User: { deletedAt: null } },
      data: {
        starRating: input.starRating,
        visitTime: input.visitTime,
        ReviewImg: input.imgList
          ? {
              deleteMany: {},
              createMany: {
                data: input.imgList.map((imgPath) => ({ imgPath })),
              },
            }
          : undefined,
        description: input.description,
      },
    });
  }

  /**
   * SOFT DELETE review WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 삭제할 리뷰 식별자
   */
  public async softDeleteReviewByIdx(idx: number): Promise<void> {
    await this.txHost.tx.review.update({
      where: {
        idx,
        deletedAt: null,
        User: { deletedAt: null, blockedAt: null },
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
