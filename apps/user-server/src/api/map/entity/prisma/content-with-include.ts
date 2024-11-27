import { Prisma } from '@prisma/client';

const ContentWithInclude = Prisma.validator<Prisma.CultureContentDefaultArgs>()(
  {
    include: {
      ContentImg: true,
      Genre: true,
      Age: true,
      Location: true,
      ContentLike: true,
    },
  },
);

/**
 * @author jochongs
 */
export type ContentWithInclude = Prisma.CultureContentGetPayload<
  typeof ContentWithInclude
>;
