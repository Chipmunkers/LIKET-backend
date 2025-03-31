import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const INQUIRY_IMG_SELECT_FIELD =
  Prisma.validator<Prisma.InquiryImgDefaultArgs>()({
    select: {
      idx: true,
      imgPath: true,
      createdAt: true,
    },
  });

/**
 * @author jochongs
 */
export type InquiryImgSelectField = Prisma.InquiryImgGetPayload<
  typeof INQUIRY_IMG_SELECT_FIELD
>;
