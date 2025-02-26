import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const REVIEW_AUTHOR_SELECT_FIELD = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    idx: true,
    profileImgPath: true,
    isAdmin: true,
  },
});

/**
 * @author jochongs
 */
export type ReviewAuthorSelectField = Prisma.UserGetPayload<
  typeof REVIEW_AUTHOR_SELECT_FIELD
>;
