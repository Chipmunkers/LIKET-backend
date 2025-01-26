import { Prisma } from '@prisma/client';

const userWithInterest = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    InterestGenre: true,
    InterestAge: true,
    InterestLocation: true,
    InterestStyle: true,
  },
});

/**
 * @author jochongs
 */
export type UserWithInterest = Prisma.UserGetPayload<typeof userWithInterest>;
