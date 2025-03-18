import { Prisma } from '@prisma/client';

const BANNER_SELECT_FIELD = Prisma.validator<Prisma.BannerDefaultArgs>()({
  select: {
    idx: true,
    imgPath: true,
    name: true,
    link: true,
    updatedAt: true,
    createdAt: true,
    ActiveBanner: {
      select: {
        activatedAt: true,
      },
    },
  },
});

export type BannerSelectField = Prisma.BannerGetPayload<
  typeof BANNER_SELECT_FIELD
>;
