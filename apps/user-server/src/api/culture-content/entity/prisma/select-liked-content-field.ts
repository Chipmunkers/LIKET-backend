import { Prisma } from '@prisma/client';

/**
 * TODO: validator 때문인지 Genre.name 이 select field에 존재하지 않더라도 에러가 나지 않는 버그가 존재함.
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
