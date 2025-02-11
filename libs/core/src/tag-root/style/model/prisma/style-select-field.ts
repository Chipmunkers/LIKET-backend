import { Prisma } from '@prisma/client';

const STYLE_SELECT_FIELD = Prisma.validator<Prisma.StyleDefaultArgs>()({
  select: {
    idx: true,
    name: true,
    createdAt: true,
  },
});

export type StyleSelectField = Prisma.StyleGetPayload<
  typeof STYLE_SELECT_FIELD
>;
