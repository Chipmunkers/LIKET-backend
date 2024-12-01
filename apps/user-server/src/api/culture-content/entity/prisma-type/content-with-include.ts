import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
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

/**
 * @author jochongs
 */
export type CotnentWithInclude = Prisma.CultureContentGetPayload<
  typeof ContentWithInclude
>;
