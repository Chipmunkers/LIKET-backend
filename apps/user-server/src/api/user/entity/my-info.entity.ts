import { PickType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { UserWithInclude } from './prisma-type/user-with-include';
import { SummaryLiketEntity } from '../../liket/entity/summary-liket.entity';
import { ReviewEntity } from 'apps/user-server/src/api/review/entity/review.entity';
import { UserModel } from 'libs/core/user/model/user.model';
import { ReviewModel } from 'libs/core/review/model/review.model';

class MyLiket extends PickType(SummaryLiketEntity, [
  'idx',
  'cardImgPath',
  'author',
] as const) {}

/**
 * @author jochongs
 */
export class MyInfoEntity extends PickType(UserEntity, [
  'idx',
  'profileImgPath',
  'nickname',
  'provider',
  'gender',
  'email',
  'birth',
  'createdAt',
]) {
  /**
   * 리뷰 개수
   *
   * @example 12
   */
  public reviewCount: number;

  /**
   * 리뷰 목록
   */
  public reviewList: ReviewEntity[];

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

  public static fromModel(
    user: UserModel,
    liketList: SummaryLiketEntity[],
    liketCount: number,
    reviewList: ReviewEntity[],
    reviewCount: number,
    contentLikeCount: number,
  ): MyInfoEntity {
    return new MyInfoEntity({
      idx: user.idx,
      profileImgPath: user.profileImgPath || null,
      nickname: user.nickname,
      provider: user.provider,
      gender: user.gender,
      email: user.email,
      birth: user.birth,
      createdAt: user.createdAt,
      reviewCount,
      reviewList,
      liketCount,
      liketList,
      likeCount: contentLikeCount,
    });
  }
}
