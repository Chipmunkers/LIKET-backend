import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';
import { SELECT_BANNER_FIELD_PRISMA } from 'apps/user-server/src/api/banner/entity/prisma/select-banner-field';

@Injectable()
export class BannerRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * 배너 목록 보기 API
   *
   * @author jochongs
   */
  public selectBannerAll() {
    return this.prisma.activeBanner.findMany({
      select: SELECT_BANNER_FIELD_PRISMA.select,
      orderBy: {
        order: 'asc',
      },
    });
  }
}
