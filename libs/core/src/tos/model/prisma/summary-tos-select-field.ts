import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const SUMMARY_TOS_SELECT_FIELD = Prisma.validator<Prisma.TosDefaultArgs>()({
  select: {
    idx: true,
    title: true,
    isEssential: true,
    createdAt: true,
    updatedAt: true,
  },
});

export type SummaryTosSelectField = Prisma.TosGetPayload<
  typeof SUMMARY_TOS_SELECT_FIELD
>;
