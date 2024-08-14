import { Prisma } from '@prisma/client';

const likeContentWithInclude =
  Prisma.validator<Prisma.CultureContent$ContentLikeArgs>()({
    include: {
      CultureContent: {
        include: {
          User: true,
          ContentImg: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              idx: 'asc',
            },
          },
          Genre: true,
          Style: {
            include: {
              Style: true,
            },
            where: {
              Style: {
                deletedAt: null,
              },
            },
          },
          Age: true,
          Location: true,
        },
      },
    },
  });

export type LikeContentWithInclude = Prisma.ContentLikeGetPayload<
  typeof likeContentWithInclude
>;
