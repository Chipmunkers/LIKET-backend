import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ReviewSelectField } from 'libs/core/review/model/prisma/review-select-field';
import { PrismaProvider } from 'libs/modules';

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
}
