import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const GENRE_SELECT_FIELD = Prisma.validator<Prisma.GenreDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    createdAt: true,
  },
});

export type GenreSelectField = Prisma.GenreGetPayload<
  typeof GENRE_SELECT_FIELD
>;
