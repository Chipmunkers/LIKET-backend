import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const CULTURE_CONTENT_AUTHOR_SELECT_FIELD =
  Prisma.validator<Prisma.UserDefaultArgs>()({
    select: {
      idx: true,
      isAdmin: true,
      email: true,
      nickname: true,
      profileImgPath: true,
    },
  });

export type CultureContentAuthorSelectField = Prisma.UserGetPayload<
  typeof CULTURE_CONTENT_AUTHOR_SELECT_FIELD
>;
