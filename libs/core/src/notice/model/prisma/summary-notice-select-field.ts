import { Prisma } from '@prisma/client';

const SUMMARY_NOTICE_SELECT_FIELD =
  Prisma.validator<Prisma.NoticeDefaultArgs>()({
    select: {
      idx: true,
      title: true,
      pinnedAt: true,
      activatedAt: true,
      createdAt: true,
    },
  });

export type SummaryNoticeSelectField = Prisma.NoticeGetPayload<
  typeof SUMMARY_NOTICE_SELECT_FIELD
>;
