import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
export const SELECT_SUMMARY_CONTENT_FIELD_PRISMA =
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
      ContentLike: {
        select: {
          userIdx: true,
        },
      },
      createdAt: true,
      acceptedAt: true,
    },
  });

/**
 * @author jochongs
 */
export type SelectSummaryContentFieldPrisma = Prisma.CultureContentGetPayload<
  typeof SELECT_SUMMARY_CONTENT_FIELD_PRISMA
>;
