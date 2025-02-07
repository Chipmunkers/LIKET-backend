import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
export const SELECT_GENRE_WITH_HOT_CONTENT_FIELD_PRISMA =
  Prisma.validator<Prisma.GenreDefaultArgs>()({
    select: {
      idx: true,
      name: true,
      CultureContent: {
        select: {
          idx: true,
          title: true,
          startDate: true,
          endDate: true,
          ContentImg: {
            select: {
              imgPath: true,
            },
          },
        },
      },
    },
  });

/**
 * @author jochongs
 */
export type SelectGenreWithHotContentFieldPrisma = Prisma.GenreGetPayload<
  typeof SELECT_GENRE_WITH_HOT_CONTENT_FIELD_PRISMA
>;
