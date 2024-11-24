import { Prisma } from '@prisma/client';

const activeBannerWithInclude = Prisma.validator<Prisma.ActiveBannerDefaultArgs>()({
  include: {
    Banner: {
      include: {
        ActiveBanner: true,
      },
    },
  },
});

export type ActiveBannerWithInclude = Prisma.ActiveBannerGetPayload<typeof activeBannerWithInclude>;
