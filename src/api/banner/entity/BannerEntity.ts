import { Banner, Prisma } from '@prisma/client';

const bannerWithInclude = Prisma.validator<Prisma.ActiveBannerDefaultArgs>()({
  include: {
    Banner: true,
  },
});

type bannerWithInclude = Prisma.ActiveBannerGetPayload<
  typeof bannerWithInclude
>;

export class BannerEntity<T extends 'active' | 'all' = 'active'> {
  idx: number;
  name: string;
  link: string;
  imgPath: string;
  order: T extends 'active' ? number : undefined;
  createdAt: Date;

  constructor(banner: {
    idx: number;
    name: string;
    link: string;
    imgPath: string;
    order: T extends 'active' ? number : undefined;
    createdAt: Date;
  }) {
    this.idx = banner.idx;
    this.name = banner.name;
    this.link = banner.link;
    this.imgPath = banner.imgPath;
    this.order = banner.order;
    this.createdAt = banner.createdAt;
  }

  static createBannerEtity(banner: Banner): BannerEntity<'all'> {
    return new BannerEntity({
      idx: banner.idx,
      name: banner.name,
      link: banner.link,
      imgPath: banner.imgPath,
      order: undefined,
      createdAt: banner.createdAt,
    });
  }

  static createActiveBannerEntity(
    banner: bannerWithInclude,
  ): BannerEntity<'active'> {
    return new BannerEntity({
      idx: banner.idx,
      name: banner.Banner.name,
      link: banner.Banner.link,
      imgPath: banner.Banner.imgPath,
      order: banner.order,
      createdAt: banner.Banner.createdAt,
    });
  }
}
