import { BannerEntity } from './banner.entity';
import { ActiveBannerWithInclude } from './prisma/ActiveBannerWithInclude';

export class ActiveBannerEntity {
  /**
   * 배너 순서
   *
   * @example 2
   */
  order: number;

  /**
   * 배너 정보
   */
  banner: BannerEntity;

  constructor(data: ActiveBannerEntity) {
    Object.assign(this, data);
  }

  static createEntity(banner: ActiveBannerWithInclude) {
    return new ActiveBannerEntity({
      banner: BannerEntity.createEntity(banner.Banner),
      order: banner.order,
    });
  }
}
