import { Prisma } from '@prisma/client';

const liketWithInclude = Prisma.validator<Prisma.LiketDefaultArgs>()({
  include: {
    LiketImgShape: true,
    Review: {
      include: {
        User: true,
        CultureContent: {
          include: {
            Genre: true,
            Location: true,
          },
        },
      },
    },
  },
});

/**
 * @author wherehows
 */
export type LiketWithInclude = Prisma.LiketGetPayload<typeof liketWithInclude>;
