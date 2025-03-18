import { BannerSelectField } from 'libs/core/banner/model/prisma/banner-select.field';

/**
 * @author jochongs
 */
export class BannerModel {
  /** 배너 식별자 */
  public readonly idx: number;

  /** 배너 이름 */
  public readonly name: string;

  /** 배너 이미지 경로 */
  public readonly imgPath: string;

  /** 배너 링크 */
  public readonly link: string;

  /** 배너 생성일 */
  public readonly createdAt: Date;

  /** 배너 최근 업데이트 일 */
  public readonly updatedAt: Date;

  /** 배너 활성화 날짜 */
  public readonly activatedAt: Date | null;

  /** 정렬 순서 */
  public readonly order: number | null;

  constructor(data: BannerModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(banner: BannerSelectField): BannerModel {
    return new BannerModel({
      idx: banner.idx,
      imgPath: banner.imgPath,
      createdAt: banner.createdAt,
      link: banner.link,
      name: banner.name,
      updatedAt: banner.updatedAt,
      activatedAt: banner.ActiveBanner?.activatedAt || null,
      order: banner.ActiveBanner?.order || null,
    });
  }
}
