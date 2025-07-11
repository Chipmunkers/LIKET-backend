import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
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
import { CoordinateRageInput } from 'libs/core/culture-content/input/coordinate-range.input';
import { CreateCultureContentInput } from 'libs/core/culture-content/input/create-culture-content.input';
import { UpdateCultureContentInput } from 'libs/core/culture-content/input/update-culture-content.input';
import { FindLikedCultureContentAllInput } from 'libs/core/culture-content/input/find-liked-culture-content-all.input';
import { LikedCultureContentSelectField } from 'libs/core/culture-content/model/prisma/liked-culture-content-select-field';
import { GenreWithHotCultureContentSelectField } from 'libs/core/culture-content/model/prisma/genre-with-hot-culture-content-select-field';

@Injectable()
export class CultureContentCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * 장르별 인기 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  public async selectHotCultureContentGroupByGenre(
    readUser?: number,
  ): Promise<GenreWithHotCultureContentSelectField[]> {
    return await this.txHost.tx.genre.findMany({
      select: {
        idx: true,
        name: true,
        CultureContent: {
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
              this.getAcceptWhereClause(true),
              this.getOpenWhereClause(['continue']),
              { deletedAt: null },
              { likeCount: { not: 0 } },
            ],
          },
          take: 4,
          orderBy: {
            likeCount: 'desc',
          },
        },
      },
      where: {
        AND: [{ deletedAt: null }],
      },
      orderBy: {
        idx: 'asc',
      },
    });
  }

  /**
   * SELECT culture_content_tb
   *
   * @author jochongs
   */
  public async selectCultureContentAll(
    {
      row,
      page,
      accept,
      searchKeyword,
      open = [],
      searchByList = [],
      order = 'desc',
      orderBy = 'accept',
      genreList = [],
      styleList = [],
      ageList = [],
      coordinateRange,
      author,
      bCode,
    }: FindCultureContentAllInput,
    readUser: number = -1,
  ): Promise<SummaryCultureContentSelectField[]> {
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
          { deletedAt: null },
          this.getAuthorWhereClause(author),
          this.getBCodeWhereClause(bCode),
          this.getGenreWhereClause(genreList),
          this.getStyleWhereClause(styleList),
          this.getAgeWhereClause(ageList),
          this.getAcceptWhereClause(accept),
          this.getOpenWhereClause(open),
          this.getSearchWhereClause(searchByList, searchKeyword),
          this.getCoordinateRangeWhereClause(coordinateRange),
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
   * 좋아요 누른 컨텐츠만 SELECT
   *
   * @author jochongs
   *
   * @param userIdx 사용자의 인덱스
   */
  public async selectLikedCultureContentAll(
    userIdx: number,
    {
      accept,
      open = [],
      page,
      row,
      genre = [],
      order = 'desc',
      orderBy = 'like',
    }: FindLikedCultureContentAllInput,
  ): Promise<LikedCultureContentSelectField[]> {
    return await this.txHost.tx.contentLike.findMany({
      select: {
        CultureContent: {
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
          },
        },
      },
      where: {
        AND: [
          { userIdx },
          { CultureContent: { deletedAt: null } },
          { CultureContent: this.getAcceptWhereClause(accept) },
          { CultureContent: this.getOpenWhereClause(open) },
          { CultureContent: this.getGenreWhereClause(genre) },
        ],
      },
      orderBy: this.getLikedContentOrderBy(orderBy, order),
      skip: (page - 1) * row,
      take: row,
    });
  }

  /**
   * 좋아요 누른 컨텐츠 정렬 방식 가져오는 메서드
   *
   * @author jochongs
   */
  private getLikedContentOrderBy(
    orderBy: 'create' | 'like' | 'accept',
    order: 'desc' | 'asc',
  ): Prisma.ContentLikeOrderByWithRelationInput {
    if (orderBy === 'create') {
      return {
        CultureContent: {
          idx: order,
        },
      };
    }

    if (orderBy === 'like') {
      return {
        createdAt: order,
      };
    }

    // accept
    return {
      CultureContent: {
        acceptedAt: order,
      },
    };
  }

  /**
   * 정렬 요소 field를 가져오는 메서드
   *
   * @author jochongs
   */
  private getOrderByFieldName(
    orderBy: 'accept' | 'like' | 'create' | 'startDate' | 'endDate',
  ): 'acceptedAt' | 'likeCount' | 'idx' | 'startDate' | 'endDate' {
    if (orderBy === 'like') {
      return 'likeCount';
    }

    if (orderBy === 'create') {
      return 'idx';
    }

    if (orderBy === 'startDate') {
      return 'startDate';
    }

    if (orderBy === 'endDate') {
      return 'endDate';
    }

    return 'acceptedAt';
  }

  /**
   * 작성자 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   *
   * @param authorIdx 작성자 식별자
   */
  private getAuthorWhereClause(
    authorIdx?: number,
  ): Prisma.CultureContentWhereInput {
    if (!authorIdx) return {};

    return {
      userIdx: authorIdx,
    };
  }

  /**
   * sido 코드 필터 WHERE 절을 가져오는 메서드
   *
   * @author jochongs
   *
   * @param bCode 시도 코드
   */
  private getBCodeWhereClause(bCode?: string): Prisma.CultureContentWhereInput {
    if (!bCode) return {};

    return {
      Location: {
        bCode: {
          startsWith: bCode,
        },
      },
    };
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
    openList: ('soon-open' | 'continue' | 'end')[],
  ): Prisma.CultureContentWhereInput {
    if (openList.length === 0) return {};

    const now = new Date();

    return {
      OR: [
        // soon-open 포함된 경우
        openList.includes('soon-open')
          ? {
              startDate: { gt: now },
              OR: [{ endDate: { gt: now } }, { endDate: null }],
            }
          : {},
        // continue 포함된 경우
        openList.includes('continue')
          ? {
              startDate: { lte: now },
              OR: [{ endDate: { gte: now } }, { endDate: null }],
            }
          : {},
        // end 포함된 경우
        openList.includes('end')
          ? {
              startDate: { lte: now },
              endDate: { lte: now },
            }
          : {},
      ],
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

  /**
   * 좌표 범위 필터링
   *
   * @author jochongs
   */
  private getCoordinateRangeWhereClause(
    input?: CoordinateRageInput,
  ): Prisma.CultureContentWhereInput {
    if (!input) return {};

    return {
      Location: {
        positionX: {
          gte: input.topX,
          lte: input.bottomX,
        },
        positionY: {
          gte: input.bottomY,
          lte: input.topY,
        },
      },
    };
  }

  /**
   * SELECT culture_content_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   * @param readUser 조회한 사용자 인덱스
   */
  public async selectCultureContentByIdx(
    idx: number,
    readUser: number = -1,
  ): Promise<CultureContentSelectField | null> {
    return await this.txHost.tx.cultureContent.findUnique({
      select: {
        idx: true,
        id: true,
        title: true,
        description: true,
        websiteLink: true,
        startDate: true,
        endDate: true,
        viewCount: true,
        openTime: true,
        isFee: true,
        isReservation: true,
        isPet: true,
        isParking: true,
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
          where: { deletedAt: null },
          orderBy: { idx: 'asc' },
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
          select: { userIdx: true },
          where: { userIdx: readUser },
        },
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  /**
   * SELECT culture_content_tb WHERE id = $1
   *
   * @author jochongs
   *
   *
   * @param contentId 컨텐츠 아이디
   * @param readUser 조회한 사용자 인덱스
   */
  public async selectCultureContentById(
    contentId: string,
    readUser: number = -1,
  ) {
    return await this.txHost.tx.cultureContent.findFirst({
      select: {
        idx: true,
        id: true,
        title: true,
        description: true,
        websiteLink: true,
        startDate: true,
        endDate: true,
        viewCount: true,
        openTime: true,
        isFee: true,
        isReservation: true,
        isPet: true,
        isParking: true,
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
          where: { deletedAt: null },
          orderBy: { idx: 'asc' },
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
          select: { userIdx: true },
          where: { userIdx: readUser },
        },
      },
      where: {
        id: contentId,
        deletedAt: null,
      },
    });
  }

  /**
   * SOFT DELETE culture_content_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 삭제할 컨텐츠 식별자
   */
  public async softDeleteContentByIdx(idx: number): Promise<void> {
    await this.txHost.tx.cultureContent.update({
      where: { idx, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * 컨텐츠의 리뷰 개수를 가져오는 메서드
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   */
  public async selectReviewCountByIdx(idx: number): Promise<number> {
    const content = await this.txHost.tx.cultureContent.findUniqueOrThrow({
      select: {
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
      where: { idx, deletedAt: null },
    });

    return content._count.Review;
  }

  /**
   * 컨텐츠의 리뷰 별점 합을 가져오는 메서드
   * ! 주의: 컨텐츠가 존재하지 않을 경우 0을 리턴합니다.
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   */
  public async selectTotalStarCountByIdx(idx: number): Promise<number> {
    const reviewSum = await this.txHost.tx.review.aggregate({
      _sum: {
        starRating: true,
      },
      where: {
        cultureContentIdx: idx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
    });

    return reviewSum._sum.starRating || 0;
  }

  /**
   * INSERT culture content
   */
  @Transactional()
  public async insertCultureContent(
    input: CreateCultureContentInput,
  ): Promise<CultureContentSelectField> {
    const createdLocation = await this.txHost.tx.location.create({
      data: {
        address: input.location.address,
        detailAddress: input.location.detailAddress,
        region1Depth: input.location.region1Depth,
        region2Depth: input.location.region2Depth,
        hCode: input.location.hCode,
        bCode: input.location.bCode,
        positionX: input.location.positionX,
        positionY: input.location.positionY,
        sidoCode: input.location.bCode.substring(0, 2),
        sggCode: input.location.bCode.substring(2, 5),
        legCode: input.location.bCode.substring(5, 8),
        riCode: input.location.bCode.substring(8, 10),
      },
    });

    const createdContent = await this.txHost.tx.cultureContent.create({
      select: {
        idx: true,
        id: true,
        title: true,
        description: true,
        websiteLink: true,
        startDate: true,
        endDate: true,
        viewCount: true,
        openTime: true,
        isFee: true,
        isReservation: true,
        isPet: true,
        isParking: true,
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
          where: { deletedAt: null },
          orderBy: { idx: 'asc' },
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
          select: { userIdx: true },
          where: { userIdx: -1 },
        },
      },
      data: {
        genreIdx: input.genreIdx,
        userIdx: input.authorIdx || 1, // 관리자 식별자
        ageIdx: input.ageIdx,
        Style: {
          createMany: {
            data: input.styleIdxList.map((style) => ({
              styleIdx: style,
            })),
          },
        },
        locationIdx: createdLocation.idx,
        id: input.id,
        title: input.title,
        ContentImg: {
          createMany: { data: input.imgList.map((imgPath) => ({ imgPath })) },
        },
        description: input.description,
        websiteLink: input.websiteLink,
        startDate: input.startDate,
        endDate: input.endDate,
        openTime: input.openTime,
        isFee: input.isFee,
        isReservation: input.isReservation,
        isParking: input.isParking,
        isPet: input.isPet,
      },
    });

    return createdContent;
  }

  /**
   * UPDATE culture_content_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   */
  @Transactional()
  public async updateCultureContentByIdx(
    idx: number,
    updateInput: UpdateCultureContentInput & { acceptedAt?: Date | null },
  ): Promise<void> {
    const updatedContent = await this.txHost.tx.cultureContent.update({
      select: { locationIdx: true },
      where: { idx, deletedAt: null },
      data: {
        genreIdx: updateInput.genreIdx,
        ageIdx: updateInput.ageIdx,
        Style: updateInput.styleIdxList
          ? {
              deleteMany: {},
              createMany: {
                data: updateInput.styleIdxList.map((style) => ({
                  styleIdx: style,
                })),
              },
            }
          : undefined,
        id: updateInput.id,
        title: updateInput.title,
        ContentImg: updateInput.imgList
          ? {
              deleteMany: {},
              createMany: {
                data: updateInput.imgList.map((imgPath) => ({ imgPath })),
              },
            }
          : undefined,
        description: updateInput.description,
        websiteLink: updateInput.websiteLink,
        startDate: updateInput.startDate,
        endDate: updateInput.endDate,
        openTime: updateInput.openTime,
        isFee: updateInput.isFee,
        isReservation: updateInput.isReservation,
        isParking: updateInput.isParking,
        isPet: updateInput.isPet,
        acceptedAt: updateInput.acceptedAt,
      },
    });

    if (updateInput.location) {
      await this.txHost.tx.location.update({
        where: { idx: updatedContent.locationIdx },
        data: {
          address: updateInput.location.address,
          detailAddress: updateInput.location.detailAddress,
          region1Depth: updateInput.location.region1Depth,
          region2Depth: updateInput.location.region2Depth,
          hCode: updateInput.location.hCode,
          bCode: updateInput.location.bCode,
          positionX: updateInput.location.positionX,
          positionY: updateInput.location.positionY,
          sidoCode: updateInput.location.bCode?.substring(0, 2),
          sggCode: updateInput.location.bCode?.substring(2, 5),
          legCode: updateInput.location.bCode?.substring(5, 8),
          riCode: updateInput.location.bCode?.substring(8, 10),
        },
      });
    }
  }

  /**
   * UPDATE culture_content_tb SET view_count = view_count + $2 WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   * @param count 상승 시킬 숫자
   */
  public async increaseViewCountByIdx(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.cultureContent.update({
      where: { idx, deletedAt: null },
      data: {
        viewCount: {
          increment: count,
        },
      },
    });
  }
}
