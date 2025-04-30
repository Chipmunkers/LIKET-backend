import { Injectable } from '@nestjs/common';
import { MapPagerbleDto } from './dto/request/map-pagerble.dto';
import { ClusteredEntity } from './entity/clustered-content.entity';
import { LoginUser } from '../auth/model/login-user';
import { MapContentPagerbleDto } from './dto/request/map-content-pagerble.dto';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class MapRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * 클러스터링 레벨에 따라 활성화된 컨텐츠 개수를 가져오는 메서드
   * 첫 번째 파라미터로 입력받은 범위 내로 검색되며 레벨의 의미는 다음과 같다.
   *
   * 레벨 1: 시/도 로 클러스터링
   * 레벨 2: 시/군/구 로 클러스터링
   * 레벨 3: 읍/면/동 으로 클러스터링
   *
   * 클러스터링 로직이 변경됨에 따라 deprecated 되었습니다.
   * 대신, getContentAllFromMap 메서드를 사용하십시오.
   *
   * @deprecated
   *
   * @author jochongs
   */
  public async getContentCountFromMapLevel(
    pagerbleDto: MapPagerbleDto,
    clusteringLevel: 1 | 2 | 3,
  ) {
    // SQL 인젝션 방지
    if (![1, 2, 3].includes(clusteringLevel)) {
      throw new Error('Critical security error');
    }

    const bottomX = pagerbleDto['bottom-x'].toFixed(12);
    const bottomY = pagerbleDto['bottom-y'].toFixed(12);
    const topX = pagerbleDto['top-x'].toFixed(12);
    const topY = pagerbleDto['top-y'].toFixed(12);

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
          (
              content.end_date >= NOW()
            OR
              content.end_date IS NULL   
          )
        AND
          lng <= $1::numeric -- bottom x
        AND
          lng >= $2::numeric -- top x
        AND
          lat <= $3::numeric
        AND
          lat >= $4::numeric
        GROUP BY
          map.code
        HAVING
          count(location.idx) != 0
    `,
      ...params,
    );
  }

  /**
   * 범위 내에 모든 컨텐츠를 가져오는 메서드
   *
   * @author jochongs
   */
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
