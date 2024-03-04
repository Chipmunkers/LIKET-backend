import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BannerEntity } from './entity/BannerEntity';
import { BannerListPagerbleDto } from './dto/BannerListPagerbleDto';
import { UpdateBannerDto } from './dto/UpdateBannerDto';
import { UpdateBannerOrderDto } from './dto/UpdateBannerOrderDto';
import { BannerNotFoundException } from './exception/BannerNotFoundException';
import { AlreadyActiveBannerException } from './exception/AlreadyActiveBannerException';
import { AlreadyDeactiveBannerException } from './exception/AlreadyDeactiveBannerException';
import { BannerOrderOutOfRangeException } from './exception/BannerOrderOutOfRangeException';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaService) {}

  // User ==============================================

  /**
   * 배너 목록보기
   */
  public getBannerAll: () => Promise<BannerEntity<'active'>[]> = async () => {
    const bannerList = await this.prisma.activeBanner.findMany({
      include: {
        Banner: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return bannerList.map((banner) =>
      BannerEntity.createActiveBannerEntity(banner),
    );
  };

  // Admin =============================================

  /**
   * 배너 목록보기
   */
  public getBannerAllForAdmin: (pagerble: BannerListPagerbleDto) => Promise<{
    bannerList: BannerEntity<'all'>[];
    count: number;
  }> = async (pagerble) => {
    const [bannerList, count] = await this.prisma.$transaction([
      this.prisma.banner.findMany({
        where: {
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
          deletedAt: null,
        },
      }),
    ]);

    return {
      bannerList: bannerList.map((banner) =>
        BannerEntity.createBannerEtity(banner),
      ),
      count,
    };
  };

  /**
   * 배너 자세히보기
   */
  public getBannerByIdxForAdmin: (
    bannerIdx: number,
  ) => Promise<BannerEntity<'all'>> = async (bannerIdx) => {
    const banner = await this.prisma.banner.findUnique({
      where: {
        idx: bannerIdx,
        deletedAt: null,
      },
    });

    if (!banner) {
      throw new BannerNotFoundException('Cannot find banner');
    }

    return BannerEntity.createBannerEtity(banner);
  };

  /**
   * 배너 수정하기
   */
  public updateBanner: (
    bannerIdx: number,
    updateDto: UpdateBannerDto,
  ) => Promise<void> = async (bannerIdx, updateDto) => {
    await this.prisma.banner.update({
      where: {
        idx: bannerIdx,
      },
      data: {
        imgPath: updateDto.img.fileName,
        link: updateDto.link,
        name: updateDto.name,
      },
    });

    return;
  };

  /**
   * 배너 삭제하기
   */
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

  /**
   * 배너 활성화하기
   */
  public activateBanner: (bannerIdx: number) => Promise<void> = async (
    bannerIdx,
  ) => {
    await this.prisma.$transaction(
      async (tx) => {
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

        if (banner.ActiveBanner) {
          throw new AlreadyActiveBannerException('Aready activated banner');
        }

        const lastActiveBanner = await this.prisma.activeBanner.findFirst({
          select: {
            order: true,
          },
          orderBy: {
            order: 'desc',
          },
        });

        await this.prisma.activeBanner.create({
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

  /**
   * 배너 비활성화하기
   */
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

  /**
   * 배너 순서 변경하기
   */
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
          throw new BadRequestException('Cannot change order to same order');
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
                gt: updateOrderDto.order,
                lte: banner.order,
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
