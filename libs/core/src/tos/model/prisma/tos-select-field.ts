import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const TOS_SELECT_FIELD = Prisma.validator<Prisma.TosDefaultArgs>()({
  select: {
    idx: true,
    title: true,
    contents: true,
    isEssential: true,
    createdAt: true,
    updatedAt: true,
  },
});

export type TosSelectField = Prisma.TosGetPayload<typeof TOS_SELECT_FIELD>;
