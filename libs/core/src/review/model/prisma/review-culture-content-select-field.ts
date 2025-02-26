import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const REVIEW_CULTURE_CONTENT_SELECT_FIELD =
  Prisma.validator<Prisma.CultureContentDefaultArgs>()({
    select: {
      idx: true,
      User: {
        select: {
          idx: true,
          nickname: true,
          email: true,
          profileImgPath: true,
          isAdmin: true,
        },
      },
      Genre: {
        select: {
          idx: true,
          name: true,
          createdAt: true,
        },
      },
      ContentImg: {
        select: {
          idx: true,
          imgPath: true,
          createdAt: true,
        },
      },
    },
  });

/**
 * @author jochongs
 */
export type ReviewCultureContentSelectField = Prisma.CultureContentGetPayload<
  typeof REVIEW_CULTURE_CONTENT_SELECT_FIELD
>;
