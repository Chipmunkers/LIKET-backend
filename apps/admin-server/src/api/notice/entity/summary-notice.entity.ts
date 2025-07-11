import { PickType } from '@nestjs/swagger';
import { NoticeEntity } from './notice.entity';
import { Notice } from '@prisma/client';

export class SummaryNoticeEntity extends PickType(NoticeEntity, [
  'idx',
  'title',
  'activatedAt',
  'pinnedAt',
  'createdAt',
]) {
  constructor(data: SummaryNoticeEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(notice: Notice) {
    return new SummaryNoticeEntity({
      idx: notice.idx,
      title: notice.title,
      activatedAt: notice.activatedAt,
      pinnedAt: notice.pinnedAt,
      createdAt: notice.createdAt,
    });
  }
}
