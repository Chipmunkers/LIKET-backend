import { PickType } from '@nestjs/swagger';
import { NoticeEntity } from './notice.entity';
import { Notice } from '@prisma/client';

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

  static createEntity(notice: Notice) {
    return new SummaryNoticeEntity({
      idx: notice.idx,
      title: notice.title,
      pinnedAt: notice.pinnedAt,
      createdAt: notice.createdAt,
    });
  }
}
