import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const REVIEW_IMG_SELECT_FIELD = Prisma.validator<Prisma.ReviewImgDefaultArgs>()(
  {
    select: {
      idx: true,
      imgPath: true,
      createdAt: true,
    },
  },
);

/**
 * @author jochongs
 */
export type ReviewImgSelectField = Prisma.ReviewGetPayload<
  typeof REVIEW_IMG_SELECT_FIELD
>;
