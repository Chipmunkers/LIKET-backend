import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const SUMMARY_INQUIRY_SELECT_FIELD =
  Prisma.validator<Prisma.InquiryDefaultArgs>()({
    select: {
      idx: true,
      title: true,
      createdAt: true,
      InquiryType: {
        select: {
          idx: true,
          name: true,
        },
      },
      InquiryImg: {
        select: {
          idx: true,
          imgPath: true,
          createdAt: true,
        },
      },
      User: {
        select: {
          idx: true,
          nickname: true,
          email: true,
          profileImgPath: true,
        },
      },
      Answer: {
        select: {
          idx: true,
        },
      },
    },
  });

/**
 * @author jochongs
 */
export type SummaryInquirySelectField = Prisma.InquiryGetPayload<
  typeof SUMMARY_INQUIRY_SELECT_FIELD
>;
