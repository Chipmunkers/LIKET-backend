import { Injectable } from '@nestjs/common';
import { BannerEntity } from './entity/banner.entity';
import { BannerCoreService } from 'libs/core/banner/banner-core.service';

@Injectable()
export class BannerService {
  constructor(private readonly bannerCoreService: BannerCoreService) {}

  /**
   * 배너 가져오기
   *
   * @author jochongs
   */
  public async getBannerAll(): Promise<BannerEntity[]> {
    const bannerList2 = await this.bannerCoreService.findActiveBannerAll({
      page: 1,
      row: 10,
    });

    return bannerList2.map(BannerEntity.fromModel);
  }
}
