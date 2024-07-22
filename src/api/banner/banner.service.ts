import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { BannerEntity } from './entity/banner.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { BannerRepository } from './banner.repository';

@Injectable()
export class BannerService {
  constructor(
    private readonly bannerRepository: BannerRepository,
    @Logger(BannerService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 배너 가져오기
   */
  public async getBannerAll(): Promise<BannerEntity[]> {
    const bannerList = await this.bannerRepository.selectBannerAll();

    return bannerList.map((banner) =>
      BannerEntity.createActiveBannerEntity(banner),
    );
  }
}
