import { Injectable } from '@nestjs/common';
import { BannerCoreRepository } from 'libs/core/banner/banner-core.repository';
import { FindBannerAllInput } from 'libs/core/banner/input/find-banner-all.input';
import { BannerModel } from 'libs/core/banner/model/banner.model';

@Injectable()
export class BannerCoreService {
  constructor(private readonly bannerCoreRepository: BannerCoreRepository) {}

  /**
   * 배너 목록보기
   *
   * @author jochongs
   */
  public async findBannerAll(
    input: FindBannerAllInput,
  ): Promise<BannerModel[]> {
    return (await this.bannerCoreRepository.selectBannerAll(input)).map(
      BannerModel.fromPrisma,
    );
  }
}
