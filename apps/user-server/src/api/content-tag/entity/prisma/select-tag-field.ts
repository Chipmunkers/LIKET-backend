import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
export const SELECT_STYLE_FIELD_PRISMA =
  Prisma.validator<Prisma.StyleDefaultArgs>()({
    select: {
      idx: true,
      name: true,
    },
  });

/**
 * @author jochongs
 */
export type SelectStyleFieldPrisma = Prisma.GenreGetPayload<
  typeof SELECT_STYLE_FIELD_PRISMA
>;

/**
 * @author jochongs
 */
export const SELECT_GENRE_FIELD_PRISMA =
  Prisma.validator<Prisma.GenreDefaultArgs>()({
    select: {
      idx: true,
      name: true,
    },
  });

/**
 * @author jochongs
 */
export type SelectGenreFieldPrisma = Prisma.GenreGetPayload<
  typeof SELECT_GENRE_FIELD_PRISMA
>;

/**
 * @author jochongs
 */
export const SELECT_AGE_FIELD_PRISMA =
  Prisma.validator<Prisma.AgeDefaultArgs>()({
    select: {
      idx: true,
      name: true,
    },
  });

/**
 * @author jochongs
 */
export type SelectAgeFieldPrisma = Prisma.AgeGetPayload<
  typeof SELECT_AGE_FIELD_PRISMA
>;
