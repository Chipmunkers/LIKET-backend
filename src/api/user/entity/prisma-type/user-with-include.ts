import { Prisma } from '@prisma/client';

const userWithInclude = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    Review: {
      include: {
        ReviewImg: true,
        CultureContent: {
          include: {
            Genre: true,
            ContentImg: true,
          },
        },
      },
    },
    Liket: {
      select: {
        idx: true,
        imgPath: true,
      },
    },
    _count: {
      select: {
        Review: true,
        Liket: true,
        ContentLike: true,
      },
    },
  },
});

export type UserWithInclude = Prisma.UserGetPayload<typeof userWithInclude>;
