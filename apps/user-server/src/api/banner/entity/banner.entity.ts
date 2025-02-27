import { SelectBannerFieldPrisma } from 'apps/user-server/src/api/banner/entity/prisma/select-banner-field';

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

  static createActiveBannerEntity(
    banner: SelectBannerFieldPrisma,
  ): BannerEntity {
    return new BannerEntity({
      idx: banner.idx,
      name: banner.Banner.name,
      link: banner.Banner.link,
      imgPath: banner.Banner.imgPath,
      order: banner.order,
    });
  }
}
