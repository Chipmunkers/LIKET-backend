import { Injectable } from '@nestjs/common';
import { NoticeNotFoundException } from './exception/NoticeNotFoundException';
import { NoticeEntity } from './entity/notice.entity';
import { NoticePageableDto } from './dto/notice-pageable.dto';
import { SummaryNoticeEntity } from './entity/summary-notice.entity';
import { NoticeCoreService } from 'libs/core/notice/notice-core.service';

@Injectable()
export class NoticeService {
  constructor(private readonly noticeCoreService: NoticeCoreService) {}

  /**
   * 공지사항 목록보기
   *
   * @author jochongs
   *
   * @param pageable 공지사항 Pageable
   */
  public async getNoticeAll(
    pageable: NoticePageableDto,
  ): Promise<SummaryNoticeEntity[]> {
    const noticeList = await this.noticeCoreService.findNoticeAll({
      page: pageable.page,
      row: 10,
      stateList: ['active'],
      orderByList: [
        {
          by: 'pin',
          order: 'desc',
        },
        {
          by: 'activated',
          order: 'desc',
        },
      ],
    });

    return noticeList.map(SummaryNoticeEntity.fromModel);
  }

  /**
   * 공지사항 자세히보기
   *
   * @author jochongs
   *
   * @param idx 공지사항 인덱스
   */
  public async getNoticeByIdx(idx: number): Promise<NoticeEntity> {
    const notice = await this.noticeCoreService.findNoticeByIdx(idx);

    if (!notice) {
      throw new NoticeNotFoundException('Cannot find Notice');
    }

    if (!notice.activatedAt) {
      throw new NoticeNotFoundException('Cannot find Notice');
    }

    return NoticeEntity.fromModel(notice);
  }
}
