import { Injectable } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { NoticeNotFoundException } from './exception/NoticeNotFoundException';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { NoticeEntity } from './entity/notice.entity';
import { NoticePageableDto } from './dto/notice-pageable.dto';
import { SummaryNoticeEntity } from './entity/summary-notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    private readonly noticeRepository: NoticeRepository,
    @Logger(NoticeService.name) private readonly logger: LoggerService,
  ) {}

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
    const noticeList = await this.noticeRepository.selectNoticeAll(pageable);

    return noticeList.map((notice) => SummaryNoticeEntity.createEntity(notice));
  }

  /**
   * 공지사항 자세히보기
   *
   * @author jochongs
   *
   * @param idx 공지사항 인덱스
   */
  public async getNoticeByIdx(idx: number): Promise<NoticeEntity> {
    const notice = await this.noticeRepository.selectNoticeByIdx(idx);

    if (!notice) {
      this.logger.warn(
        this.getNoticeByIdx,
        `Cannot find notice | idx = ${idx}`,
      );
      throw new NoticeNotFoundException('Cannot find Notice');
    }

    return NoticeEntity.createEntity(notice);
  }
}
