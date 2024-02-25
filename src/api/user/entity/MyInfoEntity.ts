import { Prisma } from '@prisma/client';
import { UserEntity } from './UserEntity';

const UserInclude = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    Review: {
      include: {
        ReviewImg: true,
      },
    },
    Liket: {
      select: {
        idx: true,
        imgPath: true,
      },
    },
    _count: {
      select: {
        Review: true,
        Liket: true,
      },
    },
  },
});

type UserInclude = Prisma.UserGetPayload<typeof UserInclude>;

export class MyInfoEntity extends UserEntity<'my', 'user'> {
  reviewCount: number;
  reviewList: {
    idx: number;
    thumbnail: string;
  }[];

  liketCount: number;
  liketList: {
    idx: number;
    imgPath: string;
  }[];

  constructor(myData: {
    idx: number;
    profileImgPath: string | null;
    nickname: string;
    provider: string;

    email: string;
    gender: number | null;
    birth: number | null;
    createdAt: Date;

    reviewCount: number;
    reviewList: {
      idx: number;
      thumbnail: string;
    }[];

    liketCount: number;
    liketList: {
      idx: number;
      imgPath: string;
    }[];
  }) {
    super({
      idx: myData.idx,
      profileImgPath: myData.profileImgPath,
      nickname: myData.nickname,
      provider: myData.provider,
      gender: myData.gender,
      email: myData.email,
      birth: myData.birth,
      createdAt: myData.createdAt,
      isAdmin: undefined,
      blockedAt: undefined,
    });

    this.reviewCount = myData.reviewCount;
    this.reviewList = myData.reviewList;

    this.liketCount = myData.liketCount;
    this.liketList = myData.liketList;
  }

  static createMyInfoEntity(user: UserInclude): MyInfoEntity {
    return new MyInfoEntity({
      idx: user.idx,
      profileImgPath: user.profileImgPath || null,
      nickname: user.nickname,
      provider: user.provider,
      gender: user.gender,
      email: user.email,
      birth: user.birth,
      createdAt: user.createdAt,

      reviewCount: user._count.Review,
      reviewList: user.Review.map((review) => ({
        idx: review.idx,
        thumbnail: review.ReviewImg[0].imgPath,
      })),
      liketCount: user._count.Liket,
      liketList: user.Liket.map((liket) => ({
        idx: liket.idx,
        imgPath: liket.imgPath,
      })),
    });
  }
}
