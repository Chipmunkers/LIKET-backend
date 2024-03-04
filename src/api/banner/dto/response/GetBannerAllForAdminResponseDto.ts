import { BannerEntity } from '../../entity/BannerEntity';

export class GetBannerAllForAdminResponseDto {
  /**
   * Banner list
   */
  bannerList: BannerEntity<'all'>[];

  /**
   * Banner count
   */
  count: number;
}
