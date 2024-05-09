import { Prisma } from '@prisma/client';

const reviewWithInclude = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  include: {
    ReviewImg: true,
    ReviewLike: true,
    User: true,
    CultureContent: {
      include: {
        User: true,
        ContentImg: true,
        Genre: true,
        Style: {
          include: {
            Style: true,
          },
        },
        Age: true,
        Location: true,
      },
    },
  },
});

export type ReviewWithInclude = Prisma.ReviewGetPayload<
  typeof reviewWithInclude
>;
