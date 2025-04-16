import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const SUMMARY_LIKET_SELECT_FIELD = Prisma.validator<Prisma.LiketDefaultArgs>()({
  select: {
    idx: true,
    cardImgPath: true,
    Review: {
      select: {
        User: {
          select: {
            idx: true,
            profileImgPath: true,
            nickname: true,
            provider: true,
          },
        },
      },
    },
  },
});

/**
 * @author jochongs
 */
export type SummaryLiketSelectField = Prisma.LiketGetPayload<
  typeof SUMMARY_LIKET_SELECT_FIELD
>;
