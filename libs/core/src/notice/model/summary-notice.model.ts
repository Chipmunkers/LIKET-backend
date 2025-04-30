import { PickType } from '@nestjs/swagger';
import { NoticeModel } from 'libs/core/notice/model/notice.model';
import { SummaryNoticeSelectField } from 'libs/core/notice/model/prisma/summary-notice-select-field';

/**
 * @author jochongs
 */
export class SummaryNoticeModel extends PickType(NoticeModel, [
  'idx',
  'title',
  'activatedAt',
  'pinnedAt',
  'createdAt',
]) {
  constructor(data: SummaryNoticeModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    notice: SummaryNoticeSelectField,
  ): SummaryNoticeModel {
    return new SummaryNoticeModel({
      idx: notice.idx,
      title: notice.title,
      activatedAt: notice.activatedAt,
      pinnedAt: notice.pinnedAt,
      createdAt: notice.createdAt,
    });
  }
}
