import { UserEntity } from '../../entity/user.entity';

export class GetUserResponseDto {
  user: UserEntity;

  /**
   * 사용자가 작성한 리뷰 개수
   *
   * @example 30
   */
  reviewCount: number;

  /**
   * 사용자 만든 라이켓 개수
   *
   * @example 24
   */
  liketCount: number;
}
