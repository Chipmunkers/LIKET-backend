import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
export const SELECT_HOT_CONTENT_FIELD_PRISMA =
  Prisma.validator<Prisma.CultureContentDefaultArgs>()({
    select: {
      idx: true,
      title: true,
      startDate: true,
      endDate: true,
      ContentImg: {
        select: {
          imgPath: true,
        },
      },
    },
  });

/**
 * @author jochongs
 */
export type SelectHotContentFieldPrisma = Prisma.CultureContentGetPayload<
  typeof SELECT_HOT_CONTENT_FIELD_PRISMA
>;
