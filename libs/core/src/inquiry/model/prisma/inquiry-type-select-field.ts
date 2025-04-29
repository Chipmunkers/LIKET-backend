import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const INQUIRY_TYPE_SELECT_FIELD =
  Prisma.validator<Prisma.InquiryTypeDefaultArgs>()({
    select: {
      idx: true,
      name: true,
    },
  });

/**
 * @author jochongs
 */
export type InquiryTypeSelectField = Prisma.InquiryTypeGetPayload<
  typeof INQUIRY_TYPE_SELECT_FIELD
>;
