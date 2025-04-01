import { ActiveBannerModel } from 'libs/core/banner/model/active-banner.model';

/**
 * @author jochongs
 */
export class BannerEntity {
  /**
   * 배너의 인덱스
   *
   * @example 12
   */
  idx: number;

  /**
   * 배너의 이름
   *
   * @example "지속X익명 깨꾹 배너"
   */
  name: string;

  /**
   * 배너 링크
   *
   * @example "https://google.com"
   */
  link: string;

  /**
   * 배너의 이미지 경로
   *
   * @example "/banner/bcd48d20-f6e3-407b-9d8a-893fc47146f2.png"
   */
  imgPath: string;

  /**
   * 배너의 순서
   *
   * @example 1
   */
  order: number;

  constructor(data: BannerEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: ActiveBannerModel): BannerEntity {
    return new BannerEntity({
      idx: model.idx,
      imgPath: model.banner.imgPath,
      link: model.banner.link,
      name: model.banner.name,
      order: model.order,
    });
  }
}
