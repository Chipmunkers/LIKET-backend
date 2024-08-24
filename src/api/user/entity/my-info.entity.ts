import { PickType } from '@nestjs/swagger';
import { LiketEntity } from '../../liket/entity/liket.entity';
import { ReviewEntity } from '../../review/entity/review.entity';
import { UserEntity } from './user.entity';
import { UserWithInclude } from './prisma-type/user-with-include';
import { TagEntity } from '../../content-tag/entity/tag.entity';

class MyReview extends PickType(ReviewEntity, [
  'idx',
  'thumbnail',
  'cultureContent',
]) {}
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
   * 라이켓 목록
   */
  public liketList: MyLiket[];

  /**
   * 좋아요 개수
   */
  public likeCount: number;

  constructor(data: MyInfoEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(user: UserWithInclude): MyInfoEntity {
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
        thumbnail: review.ReviewImg[0]?.imgPath || null,
        cultureContent: {
          idx: review.CultureContent.idx,
          genre: TagEntity.createEntity(review.CultureContent.Genre),
          likeCount: review.CultureContent.likeCount,
          thumbnail: review.CultureContent.ContentImg[0]?.imgPath || '',
          title: review.CultureContent.title,
        },
      })),
      liketCount: user._count.Liket,
      liketList: user.Liket.map((liket) => ({
        idx: liket.idx,
        imgPath: liket.imgPath,
      })),
      likeCount: user._count.ContentLike,
    });
  }
}
