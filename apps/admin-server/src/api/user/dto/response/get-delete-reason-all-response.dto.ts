import { DeleteReasonEntity } from '../../entity/delete-reason.entity';

export class GetDeleteReasonAllResponseDto {
  reasonList: DeleteReasonEntity[];

  /**
   * 검색된 탈퇴 사유 개수
   *
   * @example 23
   */
  count: number;
}
