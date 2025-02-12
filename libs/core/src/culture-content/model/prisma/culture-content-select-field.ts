import { Prisma } from '@prisma/client';

/**
 * @author jochongs
 */
const CULTURE_CONTENT_SELECT_FIELD =
  Prisma.validator<Prisma.CultureContentDefaultArgs>()({
    select: {
      idx: true,
      id: true,
      title: true,
      description: true,
      websiteLink: true,
      startDate: true,
      endDate: true,
      viewCount: true,
      openTime: true,
      isFee: true,
      isReservation: true,
      isPet: true,
      isParking: true,
      likeCount: true,
      createdAt: true,
      acceptedAt: true,
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
      Style: {
        select: {
          Style: {
            select: {
              idx: true,
              name: true,
              createdAt: true,
            },
          },
        },
      },
      Age: {
        select: {
          idx: true,
          name: true,
          createdAt: true,
        },
      },
      User: {
        select: {
          idx: true,
          nickname: true,
          email: true,
          profileImgPath: true,
          isAdmin: true,
        },
      },
    },
  });

export type CultureContentSelectField = Prisma.CultureContentGetPayload<
  typeof CULTURE_CONTENT_SELECT_FIELD
>;
