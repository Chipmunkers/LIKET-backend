import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const DELETE_REASON_TYPE_SELECT_FIELD =
  Prisma.validator<Prisma.DeleteUserTypeDefaultArgs>()({
    select: {
      idx: true,
      name: true,
    },
  });

/**
 * @author jochongs
 */
export type DeleteReasonTypeSelectField = Prisma.DeleteUserTypeGetPayload<
  typeof DELETE_REASON_TYPE_SELECT_FIELD
>;
