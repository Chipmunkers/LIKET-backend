import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { Injectable } from '@nestjs/common';
import { FindCultureContentAllInput } from 'libs/core/culture-content/input/find-culture-content-all.input';
import { CultureContentSelectField } from 'libs/core/culture-content/model/prisma/culture-content-select-field';
import { SummaryCultureContentSelectField } from 'libs/core/culture-content/model/prisma/summary-culture-content-select-field';
import { Style } from 'libs/core/tag-root/style/constant/style';
import { Prisma } from '@prisma/client';
import { Genre } from 'libs/core/tag-root/genre/constant/genre';
import { Age } from 'libs/core/tag-root/age/constant/age';

@Injectable()
export class CultureContentCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT culture_content_tb
   *
   * @author jochongs
   */
  public async selectCultureContentAll({
    row,
    page,
    accept,
    open,
    searchKeyword,
    searchByList = [],
    order = 'desc',
    orderBy = 'accept',
    genreList = [],
    styleList = [],
    ageList = [],
    readUser = -1,
  }: FindCultureContentAllInput): Promise<SummaryCultureContentSelectField[]> {
    return await this.txHost.tx.cultureContent.findMany({
      select: {
        idx: true,
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        viewCount: true,
        openTime: true,
        likeCount: true,
        createdAt: true,
        acceptedAt: true,
        Location: {
          select: {
            idx: true,
            address: true,
            detailAddress: true,
            region1Depth: true,
            region2Depth: true,
            hCode: true,
            bCode: true,
            positionX: true,
            positionY: true,
            sidoCode: true,
            sggCode: true,
            legCode: true,
            riCode: true,
          },
        },
        ContentImg: {
          select: {
            idx: true,
            imgPath: true,
            createdAt: true,
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
            createdAt: true,
          },
        },
        Style: {
          select: {
            Style: {
              select: {
                idx: true,
                name: true,
                createdAt: true,
              },
            },
          },
        },
        Age: {
          select: {
            idx: true,
            name: true,
            createdAt: true,
          },
        },
        User: {
          select: {
            idx: true,
            nickname: true,
            email: true,
            profileImgPath: true,
            isAdmin: true,
          },
        },
        ContentLike: {
          select: {
            userIdx: true,
          },
          where: {
            userIdx: readUser || -1,
          },
        },
      },
      where: {
        AND: [
          this.getGenreWhereClause(genreList),
          this.getStyleWhereClause(styleList),
          this.getAgeWhereClause(ageList),
          this.getAcceptWhereClause(accept),
          this.getOpenWhereClause(open),
          this.getSearchWhereClause(searchByList, searchKeyword),
        ],
      },
      orderBy: {
        [this.getOrderByFieldName(orderBy)]: order,
      },
      take: row,
      skip: (page - 1) * row,
    });
  }

  /**
   * 정렬 요소 field를 가져오는 메서드
   *
   * @author jochongs
   */
  private getOrderByFieldName(
    orderBy: 'accept' | 'like' | 'create',
  ): 'acceptedAt' | 'likeCount' | 'idx' {
    if (orderBy === 'like') {
      return 'likeCount';
    }

    if (orderBy === 'create') {
      return 'idx';
    }

    return 'acceptedAt';
  }

  /**
   * 스타일 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getStyleWhereClause(
    styleList: Style[],
  ): Prisma.CultureContentWhereInput {
    if (!styleList.length) return {};

    return {
      Style: {
        some: {
          styleIdx: {
            in: styleList,
          },
        },
      },
    };
  }

  /**
   * 장르 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getGenreWhereClause(
    genreList: Genre[],
  ): Prisma.CultureContentWhereInput {
    if (!genreList.length) return {};

    return {
      Genre: {
        idx: {
          in: genreList,
        },
      },
    };
  }

  /**
   * 연령대 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getAgeWhereClause(ageList: Age[]): Prisma.CultureContentWhereInput {
    if (!ageList.length) return {};

    return {
      Age: {
        idx: {
          in: ageList,
        },
      },
    };
  }

  /**
   * 활성화 컨텐츠 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getAcceptWhereClause(
    accept?: boolean,
  ): Prisma.CultureContentWhereInput {
    if (accept === undefined) return {};

    if (accept) {
      return {
        acceptedAt: {
          not: null,
        },
      };
    }

    return {
      acceptedAt: null,
    };
  }

  /**
   * 오픈 상태 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   */
  private getOpenWhereClause(
    open?: 'soon-open' | 'continue' | 'end',
  ): Prisma.CultureContentWhereInput {
    if (open === undefined) return {};

    if (open === 'soon-open') {
      return {
        startDate: {
          gt: new Date(),
        },
        OR: [
          {
            endDate: {
              gt: new Date(),
            },
          },
          {
            endDate: null,
          },
        ],
      };
    }

    if (open === 'continue') {
      return {
        startDate: {
          lte: new Date(),
        },
        OR: [
          {
            endDate: {
              gte: new Date(),
            },
          },
          {
            endDate: null,
          },
        ],
      };
    }

    // end
    return {
      startDate: {
        lte: new Date(),
      },
      endDate: {
        lte: new Date(),
      },
    };
  }

  /**
   * 검색 필터링
   *
   * @author jochongs
   */
  private getSearchWhereClause(
    searchByList: ('title' | 'user' | 'id')[],
    searchKeyword?: string,
  ): Prisma.CultureContentWhereInput {
    if (!searchByList.length || !searchKeyword) return {};

    return {
      User: searchByList.includes('user')
        ? {
            OR: [
              {
                idx: Number(searchKeyword),
              },
              {
                email: {
                  contains: searchKeyword,
                },
              },
              {
                nickname: {
                  contains: searchKeyword,
                },
              },
            ],
          }
        : undefined,
      title: searchByList.includes('title')
        ? {
            contains: searchKeyword,
          }
        : undefined,
      id: searchByList.includes('id')
        ? {
            contains: searchKeyword,
          }
        : undefined,
    };
  }
}
