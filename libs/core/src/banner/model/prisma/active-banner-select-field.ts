import { Prisma } from '@prisma/client';

const ACTIVE_BANNER_SELECT_FIELD =
  Prisma.validator<Prisma.ActiveBannerDefaultArgs>()({
    select: {
      idx: true,
      activatedAt: true,
      order: true,
      Banner: {
        select: {
          idx: true,
          name: true,
          imgPath: true,
          link: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

export type ActiveBannerSelectField = Prisma.ActiveBannerGetPayload<
  typeof ACTIVE_BANNER_SELECT_FIELD
>;
