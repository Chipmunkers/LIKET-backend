import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { MapPagerbleDto } from './dto/request/map-pagerble.dto';
import { ClusteredEntity } from './entity/clustered-content.entity';
import { LoginUser } from '../auth/model/login-user';
import { MapContentPagerbleDto } from './dto/request/map-content-pagerble.dto';

@Injectable()
export class MapRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getContentCountFromMapLevel(
    pagerbleDto: MapPagerbleDto,
    clusteringLevel: 1 | 2 | 3,
  ) {
    // SQL 인젝션 방지
    if (![1, 2, 3].includes(clusteringLevel)) {
      throw new Error('Critical security error');
    }

    const bottomX = pagerbleDto['bottom-x'];
    const bottomY = pagerbleDto['bottom-y'];
    const topX = pagerbleDto['top-x'];
    const topY = pagerbleDto['top-y'];

    const params: any[] = [bottomX, topX, topY, bottomY];

    let genreWhere = '';
    let ageWhere = '';
    let styleWhere = '';

    if (pagerbleDto.genre) {
      genreWhere = 'AND content.genre_idx = $' + (params.length + 1);
      params.push(pagerbleDto.genre);
    }

    if (pagerbleDto.age) {
      ageWhere = 'AND content.age_idx = $' + (params.length + 1);
      params.push(pagerbleDto.age);
    }

    if (pagerbleDto.styles.length) {
      const stylesPlaceholders = pagerbleDto.styles
        .map((_, index) => `$${params.length + index + 1}`)
        .join(', ');
      styleWhere = `
        AND content.idx IN (
          SELECT content_idx
          FROM style_mapping_tb
          WHERE style_idx IN (${stylesPlaceholders})
        )`;
      params.push(...pagerbleDto.styles);
    }

    return await this.prisma.$queryRawUnsafe<ClusteredEntity[]>(
      `
        SELECT
          map.code,
          map.lng,
          map.lat,
          count(location.idx)::int as count
        FROM
          location_tb location
        RIGHT JOIN
          map_level_${clusteringLevel}_tb map
        ON
          location.b_code LIKE CONCAT(map.code, '%')
        JOIN
          culture_content_tb content
        ON
          location.idx = content.location_idx
        WHERE
          content.deleted_at IS NULL
        AND
          content.accepted_at IS NOT NULL
        ${genreWhere} 
        ${ageWhere}
        ${styleWhere}
        AND
          content.start_date <= NOW()
        AND
          content.end_date >= NOW()
        AND
          lng <= $1 -- bottom x
        AND
          lng >= $2 -- top x
        AND
          lat <= $3
        AND
          lat >= $4
        GROUP BY
          map.code
        HAVING
          count(location.idx) != 0
    `,
      ...params,
    );
  }

  public async getContentAllFromMap(
    pagerbleDto: MapContentPagerbleDto,
    loginUser?: LoginUser,
  ) {
    return this.prisma.cultureContent.findMany({
      include: {
        ContentImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        ContentLike: {
          where: {
            userIdx: loginUser?.idx || -1,
          },
        },
        Location: true,
        Genre: true,
        Age: true,
      },
      where: {
        deletedAt: null,
        genreIdx: pagerbleDto.genre ? pagerbleDto.genre : undefined,
        Style: pagerbleDto.styles.length
          ? {
              some: {
                styleIdx: {
                  in: pagerbleDto.styles,
                },
              },
            }
          : undefined,
        ageIdx: pagerbleDto.age ? pagerbleDto.age : undefined,
        acceptedAt: {
          not: null,
        },
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
        Location: {
          positionX: {
            gte: pagerbleDto['top-x'],
            lte: pagerbleDto['bottom-x'],
          },
          positionY: {
            gte: pagerbleDto['bottom-y'],
            lte: pagerbleDto['top-y'],
          },
        },
      },
      orderBy: {
        idx: 'desc',
      },
    });
  }
}
