import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BannerEntity } from './entity/BannerEntity';
import { BannerListPagerbleDto } from './dto/BannerListPagerbleDto';
import { UpdateBannerDto } from './dto/UpdateBannerDto';
import { UpdateBannerOrderDto } from './dto/UpdateBannerOrderDto';

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
  ) => Promise<BannerEntity<'all'>>;

  /**
   * 배너 수정하기
   */
  public updateBanner: (
    bannerIdx: number,
    updateDto: UpdateBannerDto,
  ) => Promise<void>;

  /**
   * 배너 삭제하기
   */
  public deleteBanner: (bannerIdx: number) => Promise<void>;

  /**
   * 배너 활성화하기
   */
  public activateBanner: (bannerIdx: number) => Promise<void>;

  /**
   * 배너 비활성화하기
   */
  public deactivateBanner: (bannerIdx: number) => Promise<void>;

  /**
   * 배너 순서 변경하기
   */
  public updateBannerOrder: (
    bannerIdx: number,
    updateOrderDto: UpdateBannerOrderDto,
  ) => Promise<void>;
}
