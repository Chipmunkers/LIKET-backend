import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const REPORTED_REVIEW_SELECT_FIELD =
  Prisma.validator<Prisma.ReviewDefaultArgs>()({
    select: {
      idx: true,
      description: true,
      reportCount: true,
      likeCount: true,
      createdAt: true,
      starRating: true,
      visitTime: true,
      deletedAt: true,
      firstReportedAt: true,
      User: {
        select: {
          idx: true,
          profileImgPath: true,
          isAdmin: true,
          nickname: true,
          provider: true,
        },
      },
      ReviewImg: {
        select: {
          idx: true,
          imgPath: true,
          createdAt: true,
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
export type ReportedReviewSelectField = Prisma.ReviewGetPayload<
  typeof REPORTED_REVIEW_SELECT_FIELD
>;
