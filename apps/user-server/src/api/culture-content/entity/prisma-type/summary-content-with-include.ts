import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const SummaryContentWithInclude =
  Prisma.validator<Prisma.CultureContentDefaultArgs>()({
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
    },
  });

/**
 * @author jochongs
 */
export type SummaryCotnentWithInclude = Prisma.CultureContentGetPayload<
  typeof SummaryContentWithInclude
>;
