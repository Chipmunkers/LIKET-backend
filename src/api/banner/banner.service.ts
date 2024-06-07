import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { BannerEntity } from './entity/banner.entity';
import { BannerNotFoundException } from './exception/BannerNotFoundException';
import { AlreadyActiveBannerException } from './exception/AlreadyActiveBannerException';
import { AlreadyDeactiveBannerException } from './exception/AlreadyDeactiveBannerException';
import { BannerOrderOutOfRangeException } from './exception/BannerOrderOutOfRangeException';
import { UploadService } from '../upload/upload.service';
import { FILE_GROUPING } from '../upload/file-grouping';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all banners for all user
   */
  public getBannerAll: () => Promise<BannerEntity[]> = async () => {
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
}
