import { SummaryNoticeEntity } from '../../entity/summary-notice.entity';

export class GetNoticeAllResponseDto {
  noticeList: SummaryNoticeEntity[];

  /**
   * 검색된 총 공지사항 수
   *
   * @example 12
   */
  count: number;
}
