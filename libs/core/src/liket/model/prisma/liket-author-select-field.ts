import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const LIKET_AUTHOR_SELECT_FIELD = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    idx: true,
    profileImgPath: true,
    nickname: true,
    provider: true,
  },
});

export type LiketAuthorProfileField = Prisma.UserGetPayload<
  typeof LIKET_AUTHOR_SELECT_FIELD
>;
