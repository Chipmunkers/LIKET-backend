import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const INQUIRY_ANSWER_SELECT_FIELD =
  Prisma.validator<Prisma.AnswerDefaultArgs>()({
    select: {
      idx: true,
      contents: true,
      createdAt: true,
      inquiryIdx: true,
    },
  });

export type InquiryAnswerSelectField = Prisma.AnswerGetPayload<
  typeof INQUIRY_ANSWER_SELECT_FIELD
>;
