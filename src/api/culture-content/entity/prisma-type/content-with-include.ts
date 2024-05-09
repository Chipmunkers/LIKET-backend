import { Prisma } from '@prisma/client';

const ContentWithInclude = Prisma.validator<Prisma.CultureContentDefaultArgs>()(
  {
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
      ContentLike: true,
      _count: {
        select: {
          Review: true,
        },
      },
    },
  },
);

export type CotnentWithInclude = Prisma.CultureContentGetPayload<
  typeof ContentWithInclude
>;
