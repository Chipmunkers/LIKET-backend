import { Injectable } from '@nestjs/common';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { RedisService } from '../../common/module/redis/redis.service';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class ContentTagRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    private readonly redis: RedisService,
    @Logger(ContentTagRepository.name) private readonly logger: LoggerService,
  ) {}

  /**
   * @author jochongs
   */
  public selectGenreAll() {
    this.logger.log(this.selectGenreAll, 'SELECT genre');
    return this.prisma.genre.findMany({
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
    this.logger.log(this.selectStyleAll, 'SELECT age');
    return this.prisma.age.findMany({
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
      where: {
        idx,
      },
    });
  }

  /**
   * @author jochongs
   */
  public selectStyleAll() {
    this.logger.log(this.selectStyleAll, 'SELECT styles');
    return this.prisma.style.findMany({
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
  public selectHotStyle() {
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
   *
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
