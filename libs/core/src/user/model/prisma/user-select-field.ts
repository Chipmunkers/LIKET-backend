import { Prisma } from '@prisma/client';

const USER_SELECT_FIELD = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    idx: true,
    email: true,
    isAdmin: true,
    profileImgPath: true,
    pw: true,
    nickname: true,
    provider: true,
    reportCount: true,
    gender: true,
    birth: true,
    snsId: true,
    loginAt: true,
    createdAt: true,
    blockedAt: true,
  },
});

export type UserSelectField = Prisma.UserGetPayload<typeof USER_SELECT_FIELD>;
