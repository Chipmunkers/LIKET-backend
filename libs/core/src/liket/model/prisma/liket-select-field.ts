import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const LIKET_SELECT_FIELD = Prisma.validator<Prisma.LiketDefaultArgs>()({
  select: {
    idx: true,
    cardImgPath: true,
    size: true,
    textShape: true,
    bgImgPath: true,
    createdAt: true,
    description: true,
    LiketImgShape: {
      select: {
        imgShape: true,
      },
    },
    bgImgInfo: true,
    Review: {
      select: {
        idx: true,
        visitTime: true,
        starRating: true,
        CultureContent: {
          select: {
            idx: true,
            title: true,
            Genre: {
              select: {
                idx: true,
                name: true,
                createdAt: true,
              },
            },
            Location: {
              select: {
                idx: true,
                address: true,
                detailAddress: true,
                region1Depth: true,
                region2Depth: true,
                hCode: true,
                bCode: true,
                positionX: true,
                positionY: true,
                sidoCode: true,
                sggCode: true,
                legCode: true,
                riCode: true,
              },
            },
          },
        },
        User: {
          select: {
            idx: true,
            profileImgPath: true,
            nickname: true,
            provider: true,
          },
        },
      },
    },
  },
});

export type LiketSelectField = Prisma.LiketGetPayload<
  typeof LIKET_SELECT_FIELD
>;
