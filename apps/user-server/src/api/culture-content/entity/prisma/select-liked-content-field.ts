import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const SELECT_LIKED_CONTENT_FIELD_PRISMA =
  Prisma.validator<Prisma.CultureContent$ContentLikeArgs>()({
    select: {
      CultureContent: {
        select: {
          idx: true,
          title: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          acceptedAt: true,
          User: {
            select: {
              idx: true,
            },
          },
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
        },
      },
    },
  });

export type SelectLikedContentFieldPrisma = Prisma.ContentLikeGetPayload<
  typeof SELECT_LIKED_CONTENT_FIELD_PRISMA
>;
