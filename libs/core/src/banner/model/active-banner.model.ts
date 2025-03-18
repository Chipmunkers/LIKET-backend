import { BannerModel } from 'libs/core/banner/model/banner.model';
import { ActiveBannerSelectField } from 'libs/core/banner/model/prisma/active-banner-select-field';

/**
 * @author jochongs
 */
export class ActiveBannerModel {
  /** 배너 인덱스 */
  idx: number;

  /** 배너 순번 */
  order: number;

  /** 배너 정보 */
  banner: BannerModel;

  constructor(data: ActiveBannerModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    activeBanner: ActiveBannerSelectField,
  ): ActiveBannerModel {
    return new ActiveBannerModel({
      idx: activeBanner.idx,
      order: activeBanner.order,
      banner: BannerModel.fromPrisma({
        ...activeBanner.Banner,
        ActiveBanner: {
          activatedAt: activeBanner.activatedAt,
        },
      }),
    });
  }
}
