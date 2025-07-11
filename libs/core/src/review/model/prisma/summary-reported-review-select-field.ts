import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const SUMMARY_REPORTED_REVIEW_SELECT_FIELD =
  Prisma.validator<Prisma.ReviewDefaultArgs>()({
    select: {
      idx: true,
      reportCount: true,
      createdAt: true,
      deletedAt: true,
      firstReportedAt: true,
      description: true,
      User: {
        select: {
          idx: true,
          profileImgPath: true,
          isAdmin: true,
          nickname: true,
          provider: true,
        },
      },
      CultureContent: {
        select: {
          idx: true,
          title: true,
          likeCount: true,
          User: {
            select: {
              idx: true,
              nickname: true,
              email: true,
              profileImgPath: true,
              isAdmin: true,
            },
          },
          ContentImg: {
            select: {
              idx: true,
              imgPath: true,
              createdAt: true,
            },
          },
          Genre: {
            select: {
              idx: true,
              name: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

/**
 * @author jochongs
 */
export type SummaryReportedReviewSelectField = Prisma.ReviewGetPayload<
  typeof SUMMARY_REPORTED_REVIEW_SELECT_FIELD
>;
