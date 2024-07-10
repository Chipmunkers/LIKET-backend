import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { BannerEntity } from './entity/banner.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class BannerService {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(BannerService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 배너 가져오기
   */
  public async getBannerAll(): Promise<BannerEntity[]> {
    this.logger.log(this.getBannerAll, 'SELECT active banners');
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
  }
}
