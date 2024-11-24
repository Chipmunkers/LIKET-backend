import { Prisma } from '@prisma/client';

const bannerWithInclude = Prisma.validator<Prisma.BannerDefaultArgs>()({
  include: {
    ActiveBanner: true,
  },
});

export type BannerWithInclude = Prisma.BannerGetPayload<typeof bannerWithInclude>;
