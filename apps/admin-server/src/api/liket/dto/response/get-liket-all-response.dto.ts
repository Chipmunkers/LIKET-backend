import { LiketEntity } from '../../entity/liket.entity';

export class GetLiketAllResponseDto {
  liketList: LiketEntity[];

  /**
   * 검색된 라이켓 개수
   *
   * @example 123
   */
  count: number;
}
