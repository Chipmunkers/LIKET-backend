import { BannerWithInclude } from './prisma/BannerWithInclude';

export class BannerEntity {
  /**
   * 배너 인덱스
   *
   * @example 2
   */
  public idx: number;

  /**
   * 배너 이름
   *
   * @example 광고용 배너
   */
  public name: string;

  /**
   * 배너 링크
   *
   * @example 배너 링크
   */
  link: string;

  /**
   * 배너 이미지 경로
   *
   * @example https://liket.img.bucket/banner-img/123123.png
   */
  imgPath: string;

  /**
   * 배너 활성일
   *
   * @example 2024-05-01T10:11:12.000Z
   */
  activatedAt: Date | null;

  /**
   * 배너 생성일
   *
   * @example 2024-05-01T10:11:12.000Z
   */
  createdAt: Date;

  constructor(banner: BannerEntity) {
    Object.assign(this, banner);
  }

  static createEntity(banner: BannerWithInclude): BannerEntity {
    return new BannerEntity({
      idx: banner.idx,
      name: banner.name,
      link: banner.link,
      imgPath: banner.imgPath,
      activatedAt: banner.ActiveBanner?.activatedAt || null,
      createdAt: banner.createdAt,
    });
  }
}
