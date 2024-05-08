import { Prisma } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { LiketEntity } from '../../liket/entity/liket.entity';
import { ReviewEntity } from '../../review/entity/review.entity';
import { UserEntity } from './user.entity';

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

class MyReview extends PickType(ReviewEntity, ['idx', 'thumbnail']) {}
class MyLiket extends PickType(LiketEntity, ['idx', 'imgPath'] as const) {}

export class MyInfoEntity extends UserEntity {
  /**
   * 리뷰 개수
   *
   * @example 12
   */
  public reviewCount: number;

  /**
   * 리뷰 목록
   */
  public reviewList: MyReview[];

  /**
   * 라이켓 개수
   *
   * @example 7
   */
  public liketCount: number;

  /**
   * 라이켁 목록
   */
  public liketList: MyLiket[];

  constructor(data: MyInfoEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(user: UserInclude): MyInfoEntity {
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
