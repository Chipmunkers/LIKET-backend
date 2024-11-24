import { UserEntity } from '../../entity/user.entity';

export class GetUserAllResponseDto {
  userList: UserEntity[];

  /**
   * 검색된 총 사용자 수
   *
   * @example 123
   */
  count: number;
}
