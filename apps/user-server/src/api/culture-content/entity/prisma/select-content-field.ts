import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
export const SELECT_CONTENT_FIELD_PRISMA =
  Prisma.validator<Prisma.CultureContentDefaultArgs>()({
    select: {
      idx: true,
      title: true,
      ContentImg: {
        select: {
          imgPath: true,
        },
      },
      Genre: {
        select: {
          idx: true,
          name: true,
        },
      },
      Style: {
        select: {
          Style: {
            select: {
              idx: true,
              name: true,
            },
          },
        },
      },
      Age: {
        select: {
          idx: true,
          name: true,
        },
      },
      Location: {
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
      },
      startDate: true,
      endDate: true,
      viewCount: true,
      openTime: true,
      description: true,
      websiteLink: true,
      isFee: true,
      isReservation: true,
      isPet: true,
      isParking: true,
      likeCount: true,
      ContentLike: {
        select: {
          userIdx: true,
        },
      },
      _count: { select: { Review: true } },
      createdAt: true,
      acceptedAt: true,
    },
  });

/**
 * @author jochongs
 */
export type SelectContentFieldPrisma = Prisma.CultureContentGetPayload<
  typeof SELECT_CONTENT_FIELD_PRISMA
>;
