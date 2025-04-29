import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const REVIEW_REPORT_TYPE_AGG_SELECT_FIELD =
  Prisma.validator<Prisma.ReviewReportTypeDefaultArgs>()({
    select: {
      idx: true,
      name: true,
      _count: {
        select: {
          ReviewReport: true,
        },
      },
    },
  });

/**
 * @author jochongs
 */
export type ReviewReportTypeAggSelectField = Prisma.ReviewReportTypeGetPayload<
  typeof REVIEW_REPORT_TYPE_AGG_SELECT_FIELD
>;
