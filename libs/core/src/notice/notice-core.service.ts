import { Injectable } from '@nestjs/common';
import { CreateNoticeInput } from 'libs/core/notice/input/create-notice.input';
import { FindNoticeAllInput } from 'libs/core/notice/input/find-notice-all.input';
import { NoticeModel } from 'libs/core/notice/model/notice.model';
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

  /**
   * 공지사항 자세히보기
   *
   * @author jochongs
   *
   * @param idx 공지사항 식별자
   */
  public async findNoticeByIdx(idx: number): Promise<NoticeModel | null> {
    const notice = await this.noticeCoreRepository.selectNoticeByIdx(idx);

    return notice && NoticeModel.fromPrisma(notice);
  }

  /**
   * 공지사항 추가하기
   *
   * @author jochongs
   */
  public async createNotice(input: CreateNoticeInput): Promise<NoticeModel> {
    return NoticeModel.fromPrisma(
      await this.noticeCoreRepository.insertNotice(input),
    );
  }
}
