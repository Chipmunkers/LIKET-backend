import { Prisma } from '@prisma/client';

const genreWithContent = Prisma.validator<Prisma.GenreDefaultArgs>()({
  include: {
    CultureContent: {
      include: {
        ContentImg: true,
      },
    },
  },
});

export type GenreWithContent = Prisma.GenreGetPayload<typeof genreWithContent>;
