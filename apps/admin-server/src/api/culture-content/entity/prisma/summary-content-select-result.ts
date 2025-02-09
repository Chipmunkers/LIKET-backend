import { Prisma } from '@prisma/client';

const SUMMARY_CONTENT_SELECT_PRISMA =
  Prisma.validator<Prisma.CultureContentDefaultArgs>()({
    include: {
      User: {
        include: {
          BlockReason: true,
        },
      },
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
  });

export type SummaryContentSelectPrisma = Prisma.CultureContentGetPayload<
  typeof SUMMARY_CONTENT_SELECT_PRISMA
>;
