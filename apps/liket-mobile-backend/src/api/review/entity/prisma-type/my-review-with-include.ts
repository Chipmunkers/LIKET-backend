import { Prisma } from '@prisma/client';

const myReviewEntityWithInclude = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  include: {
    ReviewImg: true,
    CultureContent: {
      include: {
        Genre: true,
        ContentImg: true,
      },
    },
  },
});

export type MyReviewWithInclude = Prisma.ReviewGetPayload<
  typeof myReviewEntityWithInclude
>;
