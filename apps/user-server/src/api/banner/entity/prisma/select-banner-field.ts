import { Prisma } from '@prisma/client';

export const SELECT_BANNER_FIELD_PRISMA =
  Prisma.validator<Prisma.ActiveBannerDefaultArgs>()({
    select: {
      idx: true,
      order: true,
      Banner: {
        select: {
          name: true,
          link: true,
          imgPath: true,
        },
      },
    },
  });

export type SelectBannerFieldPrisma = Prisma.ActiveBannerGetPayload<
  typeof SELECT_BANNER_FIELD_PRISMA
>;
