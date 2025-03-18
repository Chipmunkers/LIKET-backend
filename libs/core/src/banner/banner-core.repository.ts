import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Prisma } from '@prisma/client';
import { PrismaProvider } from 'libs/modules';
import { FindBannerAllInput } from 'libs/core/banner/input/find-banner-all.input';
import { BannerSelectField } from 'libs/core/banner/model/prisma/banner-select.field';
import { ActiveBannerSelectField } from 'libs/core/banner/model/prisma/active-banner-select-field';

@Injectable()
export class BannerCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT active_banner_tb
   *
   * @author jochongs
   */
  public async selectBannerAll({
    page,
    row,
    order = 'desc',
    orderBy = 'time',
  }: FindBannerAllInput): Promise<BannerSelectField[]> {
    return await this.txHost.tx.banner.findMany({
      select: {
        idx: true,
        imgPath: true,
        name: true,
        link: true,
        updatedAt: true,
        createdAt: true,
        ActiveBanner: {
          select: {
            activatedAt: true,
          },
        },
      },
      where: {
        deletedAt: null,
      },
      orderBy: {
        [this.getOrderByFieldName(orderBy)]: order,
      },
      take: row,
      skip: (page - 1) * row,
    });
  }

  private getOrderByFieldName(orderBy: 'time'): 'idx' {
    return 'idx';
  }

  public async selectActiveBannerAll({
    page,
    row,
  }: FindActiveBannerAllInput): Promise<ActiveBannerSelectField[]> {
    return await this.txHost.tx.activeBanner.findMany({
      select: {
        idx: true,
        activatedAt: true,
        order: true,
        Banner: {
          select: {
            idx: true,
            name: true,
            imgPath: true,
            link: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
      take: row,
      skip: (page - 1) * row,
    });
  }
}
