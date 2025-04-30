import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const LIKET_REVIEW_SELECT_FIELD = Prisma.validator<Prisma.ReviewDefaultArgs>()({
  select: {
    idx: true,
    visitTime: true,
    starRating: true,
  },
});

/**
 * @author jochongs
 */
export type liketReviewSelectField = Prisma.ReviewGetPayload<
  typeof LIKET_REVIEW_SELECT_FIELD
>;
