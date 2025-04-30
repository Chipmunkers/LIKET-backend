import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const CULTURE_CONTENT_LOCATION_SELECT_FIELD =
  Prisma.validator<Prisma.LocationDefaultArgs>()({
    select: {
      idx: true,
      address: true,
      detailAddress: true,
      region1Depth: true,
      region2Depth: true,
      hCode: true,
      bCode: true,
      positionX: true,
      positionY: true,
      sidoCode: true,
      sggCode: true,
      legCode: true,
      riCode: true,
    },
  });

/**
 * @author jochongs
 */
export type CultureContentLocationSelectField = Prisma.LocationGetPayload<
  typeof CULTURE_CONTENT_LOCATION_SELECT_FIELD
>;
