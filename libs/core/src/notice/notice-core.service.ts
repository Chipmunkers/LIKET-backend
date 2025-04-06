import { Injectable } from '@nestjs/common';
import { FindNoticeAllInput } from 'libs/core/notice/input/find-notice-all.input';
import { SummaryNoticeModel } from 'libs/core/notice/model/summary-notice.model';
import { NoticeCoreRepository } from 'libs/core/notice/notice-core.repository';

@Injectable()
export class NoticeCoreService {
  constructor(private readonly noticeCoreRepository: NoticeCoreRepository) {}

  /**
   * 공지사항 목록보기
   *
   * @author jochongs
   */
  public async findNoticeAll(
    input: FindNoticeAllInput,
  ): Promise<SummaryNoticeModel[]> {
    return (await this.noticeCoreRepository.selectNoticeAll(input)).map(
      SummaryNoticeModel.fromPrisma,
    );
  }
}
