import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { BannerCoreRepository } from 'libs/core/banner/banner-core.repository';
import { FindBannerAllInput } from 'libs/core/banner/input/find-banner-all.input';
import { ActiveBannerModel } from 'libs/core/banner/model/active-banner.model';
import { BannerModel } from 'libs/core/banner/model/banner.model';

@Injectable()
export class BannerCoreService {
  constructor(private readonly bannerCoreRepository: BannerCoreRepository) {}

  /**
   * 배너 목록보기
   *
   * @author jochongs
   */
  @Transactional()
  public async findBannerAll(
    input: FindBannerAllInput,
  ): Promise<BannerModel[]> {
    return (await this.bannerCoreRepository.selectBannerAll(input)).map(
      BannerModel.fromPrisma,
    );
  }

  /**
   * 활성화 배너 목록 보기
   *
   * @author jochongs
   */
  @Transactional()
  public async findActiveBannerAll(
    input: FindActiveBannerAllInput,
  ): Promise<ActiveBannerModel[]> {
    return (await this.bannerCoreRepository.selectActiveBannerAll(input)).map(
      ActiveBannerModel.fromPrisma,
    );
  }

  /**
   * idx로 배너 가져오기
   *
   * @author jochongs
   *
   * @param idx 배너 식별자
   */
  @Transactional()
  public async findBannerByIdx(idx: number): Promise<BannerModel | null> {
    const banner = await this.bannerCoreRepository.selectBannerByIdx(idx);

    return banner && BannerModel.fromPrisma(banner);
  }
}
