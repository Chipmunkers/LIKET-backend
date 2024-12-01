import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const genreWithContent = Prisma.validator<Prisma.GenreDefaultArgs>()({
  include: {
    CultureContent: {
      include: {
        ContentImg: true,
      },
    },
  },
});

/**
 * @author jochongs
 */
export type GenreWithContent = Prisma.GenreGetPayload<typeof genreWithContent>;
