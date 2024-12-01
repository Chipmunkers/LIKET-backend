import { Prisma } from '@prisma/client';

const userWithInclude = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    _count: {
      select: {
        Review: true,
        ContentLike: true,
      },
    },
  },
});

/**
 * @author jochongs
 */
export type UserWithInclude = Prisma.UserGetPayload<typeof userWithInclude>;
