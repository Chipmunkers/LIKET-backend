import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const AGE_SELECT_FIELD = Prisma.validator<Prisma.AgeDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    createdAt: true,
  },
});

/**
 * @author jochongs
 */
export type AgeSelectField = Prisma.AgeGetPayload<typeof AGE_SELECT_FIELD>;
