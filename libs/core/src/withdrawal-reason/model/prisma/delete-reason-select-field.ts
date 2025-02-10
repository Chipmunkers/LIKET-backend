import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const DELETE_REASON_SELECT_FIELD =
  Prisma.validator<Prisma.DeleteUserReasonDefaultArgs>()({
    select: {
      idx: true,
      contents: true,
      DeleteUserType: {
        select: {
          idx: true,
          name: true,
        },
      },
      User: {
        select: {
          email: true,
          nickname: true,
          profileImgPath: true,
          createdAt: true,
        },
      },
    },
  });

/**
 * @author jochongs
 */
export type DeleteReasonSelectField = Prisma.DeleteUserReasonGetPayload<
  typeof DELETE_REASON_SELECT_FIELD
>;
