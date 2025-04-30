import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const INQUIRY_AUTHOR_SELECT_FIELD = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    idx: true,
    nickname: true,
    email: true,
    profileImgPath: true,
  },
});

/**
 * @author jochongs
 */
export type InquiryAuthorSelectField = Prisma.UserGetPayload<
  typeof INQUIRY_AUTHOR_SELECT_FIELD
>;
