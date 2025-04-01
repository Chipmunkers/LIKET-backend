import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const NOTICE_SELECT_FIELD = Prisma.validator<Prisma.NoticeDefaultArgs>()({
  select: {
    idx: true,
    title: true,
    contents: true,
    pinnedAt: true,
    activatedAt: true,
    createdAt: true,
  },
});

export type NoticeSelectField = Prisma.NoticeGetPayload<
  typeof NOTICE_SELECT_FIELD
>;
