import { BannerEntity } from '../../entity/banner.entity';

export class GetBannerAllResponseDto {
  bannerList: BannerEntity[];

  /**
   * 배너의 개수
   *
   * @example 24
   */
  count: number;
}
