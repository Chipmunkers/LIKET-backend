import { Injectable } from '@nestjs/common';
import { BannerEntity } from './entity/banner.entity';
import { GetBannerAllPagerbleDto } from './dto/request/get-banner-all-pagerble.dto';
import { BannerNotFoundException } from './exception/BannerNotFoundException';
import { CreateBannerDto } from './dto/request/create-banner.dto';
import { UpadteBannerDto } from './dto/request/update-banner.dto';
import { AlreadyActiveBannerException } from './exception/AlreadyActiveBannerExcepion';
import { AlreadyDeactiveBannerException } from './exception/AlreadyDeactiveBannerException';
import { UpdateBannerOrderDto } from './dto/request/update-banner-order.dto';
import { SameBannerOrderException } from './exception/SameBannerOrderException';
import { BannerOrderOutOfRangeException } from './exception/BannerOrderOutOfRangeException';
import { ActiveBannerEntity } from './entity/active-banner.entity';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaProvider) {}

  public getActiveBannerAll: () => Promise<{
    bannerList: ActiveBannerEntity[];
  }> = async () => {
    const [bannerList] = await this.prisma.$transaction([
      this.prisma.activeBanner.findMany({
        include: {
          Banner: {
            include: {
              ActiveBanner: true,
            },
          },
        },
        where: {
          Banner: {
            deletedAt: null,
          },
        },
        orderBy: {
          order: 'asc',
        },
      }),
    ]);

    return {
      bannerList: bannerList.map((banner) =>
        ActiveBannerEntity.createEntity(banner),
      ),
    };
  };

  public getBannerAll: (pagerble: GetBannerAllPagerbleDto) => Promise<{
    bannerList: BannerEntity[];
    count: number;
  }> = async (pagerble) => {
    const [bannerList, count] = await this.prisma.$transaction([
      this.prisma.banner.findMany({
        include: {
          ActiveBanner: true,
        },
        where: {
          name: pagerble.search
            ? {
                contains: pagerble.search,
              }
            : undefined,
          deletedAt: null,
        },
        orderBy: {
          idx: pagerble.order,
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
      this.prisma.banner.count({
        where: {
          name: pagerble.search
            ? {
                contains: pagerble.search,
              }
            : undefined,
          deletedAt: null,
        },
      }),
    ]);

    return {
      bannerList: bannerList.map((banner) => BannerEntity.createEntity(banner)),
      count,
    };
  };

  public getBannerByIdx: (bannerIdx: number) => Promise<BannerEntity> = async (
    bannerIdx,
  ) => {
    const banner = await this.prisma.banner.findUnique({
      include: {
        ActiveBanner: true,
      },
      where: {
        idx: bannerIdx,
        deletedAt: null,
      },
    });

    if (!banner) {
      throw new BannerNotFoundException('Cannot find banner');
    }

    return BannerEntity.createEntity(banner);
  };

  public createBanner: (createDto: CreateBannerDto) => Promise<number> = async (
    createDto,
  ) => {
    const createdBanner = await this.prisma.banner.create({
      data: {
        name: createDto.name,
        link: createDto.link,
        imgPath: createDto.file.path,
      },
    });

    return createdBanner.idx;
  };

  public updateBanner: (
    bannerIdx: number,
    updateDto: UpadteBannerDto,
  ) => Promise<void> = async (bannerIdx, updateDto) => {
    await this.prisma.banner.update({
      where: {
        idx: bannerIdx,
      },
      data: {
        imgPath: updateDto.file.path,
        link: updateDto.link,
        name: updateDto.name,
      },
    });

    return;
  };

  public deleteBanner: (bannerIdx: number) => Promise<void> = async (
    bannerIdx,
  ) => {
    await this.prisma.$transaction(
      async (tx) => {
        const banner = await tx.banner.findUnique({
          include: {
            ActiveBanner: true,
          },
          where: {
            idx: bannerIdx,
            deletedAt: null,
          },
        });

        if (!banner) {
          throw new BannerNotFoundException('Cannot find banner');
        }

        if (banner.ActiveBanner) {
          await tx.activeBanner.delete({
            where: {
              idx: bannerIdx,
            },
          });

          await tx.activeBanner.updateMany({
            where: {
              order: {
                gt: banner.ActiveBanner.order,
              },
            },
            data: {
              order: {
                decrement: 1,
              },
            },
          });
        }

        await tx.banner.update({
          where: {
            idx: banner.idx,
          },
          data: {
            deletedAt: new Date(),
          },
        });

        return;
      },
      {
        isolationLevel: 'RepeatableRead',
      },
    );

    return;
  };

  public activateBanner: (bannerIdx: number) => Promise<void> = async (
    bannerIdx,
  ) => {
    await this.prisma.$transaction(
      async (tx) => {
        const banner = await tx.banner.findUnique({
          include: {
            ActiveBanner: true,
          },
          where: {
            idx: bannerIdx,
            deletedAt: null,
          },
        });

        if (!banner) {
          throw new BannerNotFoundException('Cannot find banner');
        }

        if (banner.ActiveBanner) {
          throw new AlreadyActiveBannerException('Aready activated banner');
        }

        const lastActiveBanner = await tx.activeBanner.findFirst({
          select: {
            order: true,
          },
          orderBy: {
            order: 'desc',
          },
        });

        await tx.activeBanner.create({
          data: {
            idx: bannerIdx,
            order: (lastActiveBanner?.order || 0) + 1,
          },
        });

        return;
      },
      {
        isolationLevel: 'RepeatableRead',
      },
    );

    return;
  };

  public deactivateBanner: (bannerIdx: number) => Promise<void> = async (
    bannerIdx,
  ) => {
    await this.prisma.$transaction(
      async (tx) => {
        const banner = await tx.banner.findUnique({
          include: {
            ActiveBanner: true,
          },
          where: {
            idx: bannerIdx,
            deletedAt: null,
          },
        });

        if (!banner) {
          throw new BannerNotFoundException('Cannot find banner');
        }

        if (!banner.ActiveBanner) {
          throw new AlreadyDeactiveBannerException(
            'Already deactivated banner',
          );
        }

        await tx.activeBanner.delete({
          where: {
            idx: bannerIdx,
          },
        });

        await tx.activeBanner.updateMany({
          where: {
            order: {
              gt: banner.ActiveBanner.order,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });

        return;
      },
      {
        isolationLevel: 'RepeatableRead',
      },
    );

    return;
  };

  public updateBannerOrder: (
    bannerIdx: number,
    updateOrderDto: UpdateBannerOrderDto,
  ) => Promise<void> = async (bannerIdx, updateOrderDto) => {
    await this.prisma.$transaction(
      async (tx) => {
        const banner = await tx.activeBanner.findUnique({
          where: {
            idx: bannerIdx,
          },
        });

        if (!banner) {
          throw new BannerNotFoundException('Cannot find banner');
        }

        if (banner.order === updateOrderDto.order) {
          throw new SameBannerOrderException(
            'Cannot change order to same order',
          );
        }

        const lastActiveBanner = await tx.activeBanner.findFirst({
          orderBy: {
            order: 'desc',
          },
        });

        if (!lastActiveBanner) {
          throw new BannerOrderOutOfRangeException(
            'Cannot be exceeded the maximum order',
          );
        }

        if (updateOrderDto.order > lastActiveBanner.order) {
          throw new BannerOrderOutOfRangeException(
            'Cannot be exeeded the maximum order',
          );
        }

        // 3 -> 1
        if (banner.order > updateOrderDto.order) {
          await tx.activeBanner.updateMany({
            where: {
              order: {
                gte: updateOrderDto.order,
                lt: banner.order,
              },
            },
            data: {
              order: {
                increment: 1,
              },
            },
          });
        }

        // 2 -> 6
        if (banner.order < updateOrderDto.order) {
          await tx.activeBanner.updateMany({
            where: {
              order: {
                gt: banner.order,
                lte: updateOrderDto.order,
              },
            },
            data: {
              order: {
                decrement: 1,
              },
            },
          });
        }

        await tx.activeBanner.update({
          where: {
            idx: bannerIdx,
          },
          data: {
            order: updateOrderDto.order,
          },
        });

        return;
      },
      {
        isolationLevel: 'RepeatableRead',
      },
    );

    return;
  };
}
