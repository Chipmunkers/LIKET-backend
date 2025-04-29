import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const LIKET_CULTURE_CONTENT_SELECT_FIELD =
  Prisma.validator<Prisma.CultureContentDefaultArgs>()({
    select: {
      idx: true,
      title: true,
      Genre: {
        select: {
          idx: true,
          name: true,
          createdAt: true,
        },
      },
      Location: {
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
      },
    },
  });

/**
 * @author jochongs
 */
export type LiketCultureContentSelectField = Prisma.CultureContentGetPayload<
  typeof LIKET_CULTURE_CONTENT_SELECT_FIELD
>;
