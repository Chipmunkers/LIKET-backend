import { Prisma } from '@prisma/client';

const summaryLiketWithInclude = Prisma.validator<Prisma.LiketDefaultArgs>()({
  include: {
    Review: {
      include: {
        User: true,
      },
    },
  },
});

export type SummaryLiketWithInclude = Prisma.LiketGetPayload<
  typeof summaryLiketWithInclude
>;
