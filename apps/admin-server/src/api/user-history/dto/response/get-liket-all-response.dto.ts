import { LiketEntity } from '../../../liket/entity/liket.entity';

export class GetLiketAllResponseDto {
  liketList: LiketEntity[];

  /**
   * 검색된 리뷰 총 개수
   *
   * @example 12
   */
  count: number;
}
