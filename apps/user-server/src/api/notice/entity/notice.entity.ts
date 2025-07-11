import { Notice } from '@prisma/client';
import { NoticeModel } from 'libs/core/notice/model/notice.model';

/**
 * @author jochongs
 */
export class NoticeEntity {
  /**
   * 공지사항 인덱스
   *
   * @example 12
   */
  idx: number;

  /**
   * 공지사항 제목
   *
   * @example "[공지사항] 서비스 점검 예정"
   */
  title: string;

  /**
   * 공지사항 내용
   *
   * @example "서비스 점검이 예정되어있습니다."
   */
  contents: string;

  /**
   * 상단 고정일 (상단 고정 여부를 확인할 때 필요)
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  pinnedAt: Date | null;

  /**
   * 공지사항 작성일
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  createdAt: Date;

  constructor(data: NoticeEntity) {
    Object.assign(this, data);
  }

  /**
   * `CoreModule`이 개발됨에 따라, deprecated 되었습니다.
   * 대신, `fromModel`을 사용합시오.
   *
   * @deprecated
   */
  static createEntity(notice: Notice) {
    return new NoticeEntity({
      idx: notice.idx,
      title: notice.title,
      contents: notice.contents,
      pinnedAt: notice.pinnedAt,
      createdAt: notice.createdAt,
    });
  }

  public static fromModel(notice: NoticeModel): NoticeEntity {
    return new NoticeEntity({
      idx: notice.idx,
      title: notice.title,
      contents: notice.contents,
      createdAt: notice.createdAt,
      pinnedAt: notice.pinnedAt,
    });
  }
}
