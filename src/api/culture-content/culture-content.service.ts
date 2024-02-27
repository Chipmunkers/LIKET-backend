import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateContentRequestDto } from './dto/CreateContentRequestDto';
import { ContentRequestListPagenationDto } from './dto/ContentRequestListPagenationDto';
import { UpdateContentDto } from './dto/UpdateContentDto';
import { ContentListPagenationDto } from './dto/ContentListPagenationDto';
import { ContentEntity } from './entity/ContentEntity';
import { ContentNotFoundException } from './exception/ContentNotFound';

@Injectable()
export class CultureContentService {
  constructor(private readonly prisma: PrismaService) {}

  // Content ==================================================

  /**
   * 컨텐츠 자세히보기
   */
  public getContentByIdx: (
    idx: number,
    userIdx: number,
  ) => Promise<ContentEntity<'detail', 'user'>> = async (idx, userIdx) => {
    const content = await this.prisma.cultureContent.findUnique({
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
        ContentLike: {
          where: {
            userIdx,
          },
        },
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
      where: {
        idx,
        deletedAt: null,
      },
    });

    const reviewStar = await this.prisma.review.aggregate({
      _sum: {
        starRating: true,
      },
      where: {
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
    });

    if (!content || !reviewStar._sum.starRating) {
      throw new ContentNotFoundException('Cannot find content');
    }

    return ContentEntity.createUserDetailContent(
      content,
      reviewStar._sum.starRating,
    );
  };

  /**
   * 컨텐츠 목록 보기
   */
  public getContentAll: (
    pagenation: ContentListPagenationDto,
    userIdx: number,
  ) => Promise<ContentEntity<'summary', 'user'>[]> = async (
    pagenation,
    userIdx,
  ) => {
    const contentList = await this.prisma.cultureContent.findMany({
      include: {
        User: true,
        ContentImg: true,
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
        ContentLike: {
          where: {
            userIdx,
          },
        },
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
      where: {
        genreIdx: pagenation.genre || undefined,
        ageIdx: pagenation.age || undefined,
        Style: pagenation.style
          ? {
              some: {
                Style: {
                  deletedAt: null,
                },
              },
            }
          : undefined,
        Location: pagenation.region
          ? {
              hCode: pagenation.region,
            }
          : undefined,
        startDate: pagenation.open
          ? {
              lte: new Date(),
            }
          : undefined,
        endDate: pagenation.open
          ? {
              gte: new Date(),
            }
          : undefined,
        acceptedAt: null,
        deletedAt: null,
        User: {
          deletedAt: null,
          blockedAt: null,
        },
      },
      orderBy: {
        [pagenation.orderby === 'time' ? 'idx' : 'likeCount']: pagenation.order,
      },
      take: 10,
      skip: (pagenation.page - 1) * 10,
    });

    return contentList.map((content) =>
      ContentEntity.createUserSummaryContent(content),
    );
  };

  // Content Request ==========================================

  /**
   * 컨텐츠 요청 자세히보기
   */
  public getContentRequestByIdx: (
    idx: number,
  ) => Promise<ContentEntity<'detail', 'admin'>> = async (idx) => {
    const content = await this.prisma.cultureContent.findUnique({
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
        ContentLike: {
          where: {
            userIdx: -1,
          },
        },
        _count: {
          select: {
            Review: true,
          },
        },
      },
      where: {
        idx,
        deletedAt: null,
        User: {
          deletedAt: null,
          blockedAt: null,
        },
      },
    });

    const starRatingSum = await this.prisma.review.aggregate({
      where: {
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
      _sum: {
        starRating: true,
      },
    });

    if (!content || !starRatingSum._sum.starRating) {
      throw new ContentNotFoundException('Cannot find culture content request');
    }

    return ContentEntity.createAdminDetailContent(
      content,
      starRatingSum._sum.starRating,
    );
  };

  /**
   * 컨텐츠 요청 목록 보기
   */
  public getContentRequestAll: (
    pagenation: ContentRequestListPagenationDto,
  ) => Promise<{
    contentList: ContentEntity<'summary', 'admin'>[];
    count: number;
  }> = async (pagenation) => {
    const [count, contentList] = await this.prisma.$transaction([
      this.prisma.cultureContent.count({
        where: {
          genreIdx: pagenation.genre || undefined,
          ageIdx: pagenation.age || undefined,
          Style: pagenation.style
            ? {
                some: {
                  Style: {
                    deletedAt: null,
                  },
                },
              }
            : undefined,
          Location: pagenation.region
            ? {
                hCode: pagenation.region,
              }
            : undefined,
          startDate: pagenation.open
            ? {
                lte: new Date(),
              }
            : undefined,
          endDate: pagenation.open
            ? {
                gte: new Date(),
              }
            : undefined,
          deletedAt: null,
          User: {
            deletedAt: null,
            blockedAt: null,
          },
        },
      }),
      this.prisma.cultureContent.findMany({
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
          ContentLike: {
            where: {
              userIdx: -1,
            },
          },
          _count: {
            select: {
              Review: true,
            },
          },
        },
        where: {
          genreIdx: pagenation.genre || undefined,
          ageIdx: pagenation.age || undefined,
          Style: pagenation.style
            ? {
                some: {
                  Style: {
                    deletedAt: null,
                  },
                },
              }
            : undefined,
          Location: pagenation.region
            ? {
                hCode: pagenation.region,
              }
            : undefined,
          startDate: pagenation.open
            ? {
                lte: new Date(),
              }
            : undefined,
          endDate: pagenation.open
            ? {
                gte: new Date(),
              }
            : undefined,
          deletedAt: null,
          User: {
            deletedAt: null,
            blockedAt: null,
          },
        },
        orderBy: {
          idx: pagenation.order,
        },
        take: 10,
        skip: (pagenation.page - 1) * 10,
      }),
    ]);

    return {
      contentList: contentList.map((content) =>
        ContentEntity.createAdminSummaryContent(content),
      ),
      count,
    };
  };

  /**
   * 컨텐츠 요청하기
   */
  public createContentRequest: (
    userIdx: number,
    createDto: CreateContentRequestDto,
  ) => Promise<number>;

  /**
   * 컨텐츠 요청 수정하기
   */
  public updateContentRequest: (
    idx: number,
    updateDto: UpdateContentDto,
  ) => Promise<void>;

  /**
   * 컨텐츠 요청 삭제하기
   */
  public deleteContentRequest: (idx: number) => Promise<void>;

  /**
   * 요청 수락하기
   */
  public acceptContentRequest: (idx: number) => Promise<void>;

  /**
   * 비활성화 하기
   */
  public deactivateContent: (idx: number) => Promise<void>;

  /**
   * 컨텐츠 좋아요 누르기
   */
  public likeContent: (userIdx: number, contentIdx: number) => Promise<void>;

  /**
   * 컨텐츠 좋아요 취소하기
   */
  public cancelToLikeContent: (
    userIdx: number,
    contentIdx: number,
  ) => Promise<void>;
}
