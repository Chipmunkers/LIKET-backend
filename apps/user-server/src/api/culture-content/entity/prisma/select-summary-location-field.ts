import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
export const SELECT_SUMMARY_LOCATION_FIELD_PRISMA =
  Prisma.validator<Prisma.LocationDefaultArgs>()({
    select: {
      region1Depth: true,
      region2Depth: true,
    },
  });

/**
 * @author jochongs
 */
export type SelectSummaryLocationFieldPrisma = Prisma.LocationGetPayload<
  typeof SELECT_SUMMARY_LOCATION_FIELD_PRISMA
>;
