import { PickType } from '@nestjs/swagger';
import { NoticeEntity } from './notice.entity';
import { Notice } from '@prisma/client';
import { SummaryNoticeModel } from 'libs/core/notice/model/summary-notice.model';

/**
 * @author jochongs
 */
export class SummaryNoticeEntity extends PickType(NoticeEntity, [
  'idx',
  'title',
  'createdAt',
  'pinnedAt',
]) {
  constructor(data: SummaryNoticeEntity) {
    super();
    Object.assign(this, data);
  }

  /**
   * `CoreModule`이 개발됨에 따라, deprecated 되었습니다.
   * 대신, `fromModel`을 사용합시오.
   *
   * @deprecated
   */
  static createEntity(notice: Notice) {
    return new SummaryNoticeEntity({
      idx: notice.idx,
      title: notice.title,
      pinnedAt: notice.pinnedAt,
      createdAt: notice.createdAt,
    });
  }

  public static fromModel(notice: SummaryNoticeModel): SummaryNoticeEntity {
    return new SummaryNoticeEntity({
      idx: notice.idx,
      title: notice.title,
      pinnedAt: notice.pinnedAt,
      createdAt: notice.createdAt,
    });
  }
}
