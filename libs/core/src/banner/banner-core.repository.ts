import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Prisma } from '@prisma/client';
import { PrismaProvider } from 'libs/modules';
import { FindBannerAllInput } from 'libs/core/banner/input/find-banner-all.input';
import { BannerSelectField } from 'libs/core/banner/model/prisma/banner-select.field';
import { ActiveBannerSelectField } from 'libs/core/banner/model/prisma/active-banner-select-field';
import { FindActiveBannerAllInput } from 'libs/core/banner/input/find-active-banner-all.input';
import { CreateBannerInput } from 'libs/core/banner/input/create-banner.input';
import { UpdateBannerInput } from 'libs/core/banner/input/update-banner.input';

@Injectable()
export class BannerCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT banner_tb
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
            order: true,
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

  /**
   * 정렬 필드명을 가져오는 메서드
   *
   * @author jochongs
   */
  private getOrderByFieldName(orderBy: 'time'): 'idx' {
    return 'idx';
  }

  /**
   * SELECT active_banner_tb
   *
   * @author jochongs
   */
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

  /**
   * SELECT banner_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 배너 식별자
   */
  public async selectBannerByIdx(
    idx: number,
  ): Promise<BannerSelectField | null> {
    return await this.txHost.tx.banner.findUnique({
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
            order: true,
          },
        },
      },
      where: { idx, deletedAt: null },
    });
  }

  /**
   * INSERT banner_tb
   *
   * @author jochongs
   */
  public async insertBanner(
    input: CreateBannerInput,
  ): Promise<BannerSelectField> {
    return await this.txHost.tx.banner.create({
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
            order: true,
          },
        },
      },
      data: {
        name: input.name,
        imgPath: input.imgPath,
        link: input.link,
      },
    });
  }

  /**
   * UPDATE banner_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 배너 식별자
   */
  public async updateBannerByIdx(
    idx: number,
    input: UpdateBannerInput,
  ): Promise<void> {
    await this.txHost.tx.banner.update({
      where: { idx, deletedAt: null },
      data: {
        name: input.name,
        imgPath: input.imgPath,
        link: input.link,
      },
    });
  }

  /**
   * SOFT DELETE banner_tb WHERE idx = $1
   *
   * @author jochongs
   */
  public async softDeleteBannerByIdx(idx: number): Promise<void> {
    await this.txHost.tx.banner.update({
      where: { idx, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * DELETE active_banner_tb WHERE idx = $1
   *
   * @author jochongs
   */
  public async deleteActiveBannerByIdx(idx: number): Promise<void> {
    await this.txHost.tx.activeBanner.delete({
      where: { idx },
    });
  }

  /**
   * UPDATE active_banner_tb SET order = $2 WHERE order
   *
   * @author jochongs
   *
   * @param where 초과, 이상, 미만, 이하 조건
   * @param order where 조건절의 수치
   * @param amount 어떤 수치 만큼 업데이트 시킬지
   *
   * @example
   * ```ts
   * // order가 2초과인 모든 활성 배너 순서를 1만큼 상승 시키는 방법
   * updateManyBannerOrder('gt', 2, 1);
   * ```
   */
  public async updateManyBannerOrder(
    where: 'gt' | 'gte' | 'lt' | 'lte',
    order: number,
    amount: number,
  ): Promise<void> {
    await this.txHost.tx.activeBanner.updateMany({
      where: {
        order: {
          [where]: order,
        },
      },
      data: {
        order: {
          increment: amount,
        },
      },
    });
  }

  /**
   * UPDATE active_banner_tb SET order = $2 WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 배너 식별자
   * @param order 변경 시킬 순서
   */
  public async updateBannerOrderByIdx(
    idx: number,
    order: number,
  ): Promise<void> {
    await this.txHost.tx.activeBanner.update({
      where: { idx },
      data: { order },
    });
  }
}
