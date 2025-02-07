import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
export const SELECT_LOCATION_FIELD_PRISMA =
  Prisma.validator<Prisma.LocationDefaultArgs>()({
    select: {
      region1Depth: true,
      region2Depth: true,
      detailAddress: true,
      address: true,
      positionX: true,
      positionY: true,
      hCode: true,
      bCode: true,
    },
  });

/**
 * @author jochongs
 */
export type SelectLocationFieldPrisma = Prisma.LocationGetPayload<
  typeof SELECT_LOCATION_FIELD_PRISMA
>;
