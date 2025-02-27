import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/module/redis/redis.service';
import { PrismaProvider } from 'libs/modules';
import {
  SELECT_AGE_FIELD_PRISMA,
  SELECT_GENRE_FIELD_PRISMA,
  SELECT_STYLE_FIELD_PRISMA,
} from 'apps/user-server/src/api/content-tag/entity/prisma/select-tag-field';

@Injectable()
export class ContentTagRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    private readonly redis: RedisService,
  ) {}

  /**
   * @author jochongs
   */
  public selectGenreAll() {
    return this.prisma.genre.findMany({
      select: SELECT_GENRE_FIELD_PRISMA.select,
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'desc',
      },
    });
  }

  /**
   * @author jochongs
   */
  public selectAgeAll() {
    return this.prisma.age.findMany({
      select: SELECT_AGE_FIELD_PRISMA.select,
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'desc',
      },
    });
  }

  /**
   * @author jochongs
   */
  public selectAgeByIdx(idx: number) {
    return this.prisma.age.findUniqueOrThrow({
      select: SELECT_AGE_FIELD_PRISMA.select,
      where: {
        idx,
      },
    });
  }

  /**
   * @author jochongs
   */
  public selectStyleAll() {
    return this.prisma.style.findMany({
      select: SELECT_STYLE_FIELD_PRISMA.select,
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'desc',
      },
    });
  }

  /**
   * 인기 스타일 목록 불러오기
   *
   * @author jochongs
   */
  public async selectHotStyle() {
    return this.prisma.style
      .findMany({
        select: {
          idx: true,
          name: true,
          _count: {
            select: {
              Style: {
                where: {
                  CultureContent: {
                    deletedAt: null,
                    acceptedAt: {
                      not: null,
                    },
                  },
                },
              },
            },
          },
        },
      })
      .then((styles) =>
        styles.sort((prev, next) => next._count.Style - prev._count.Style),
      )
      .then((styles) => styles[0]);
  }

  private readonly HOT_STYLE_CACHE_KEY = 'HOT_STYLE_CACHE_KEY';

  /**
   * 스타일 가져오기. 각 스타일 태그가 연결되어있는 컨텐츠 개수를 계산해서 가져옴
   * !주의: 메인 페이지 기능 변경에 따라 삭제될 예정입니다.
   *
   * @deprecated
   * @author jochongs
   */
  public async selectStylesWithContentCount(): Promise<
    { idx: number; name: string; count: number }[]
  > {
    const cacheData = await this.redis.get(this.HOT_STYLE_CACHE_KEY);

    if (cacheData) {
      return JSON.parse(cacheData);
    }

    const result = await this.prisma.$queryRaw<
      {
        idx: number;
        name: string;
        count: number;
      }[]
    >`
      SELECT
        idx, name,
        (
          SELECT
            COUNT(*)::int
          FROM
            style_mapping_tb
          JOIN
            culture_content_tb
          ON
            culture_content_tb.idx = style_mapping_tb.content_idx
          WHERE
            style_idx = style_tb.idx
          AND
            culture_content_tb.accepted_at IS NOT NULL
          AND
            culture_content_tb.deleted_at IS NULL
          AND
            culture_content_tb.start_date <= NOW()
          AND
            culture_content_tb.end_date >= NOW()
        ) AS count
      FROM
        style_tb
      ORDER BY
        count desc
    `;
    const cachingData = JSON.stringify(result);
    await this.redis.set(this.HOT_STYLE_CACHE_KEY, cachingData, 60 * 1000);

    return result;
  }
}
