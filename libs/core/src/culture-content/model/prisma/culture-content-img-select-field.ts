import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const CULTURE_CONTENT_IMG_SELECT_FIELD =
  Prisma.validator<Prisma.ContentImgDefaultArgs>()({
    select: {
      idx: true,
      imgPath: true,
      createdAt: true,
    },
  });

export type CultureContentImgSelectField = Prisma.ContentImgGetPayload<
  typeof CULTURE_CONTENT_IMG_SELECT_FIELD
>;
