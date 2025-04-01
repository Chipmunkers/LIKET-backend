import { NoticeSelectField } from 'libs/core/notice/model/prisma/notice-select-field';

/**
 * @author jochongs
 */
export class NoticeModel {
  /** 공지사항 식별자 */
  public readonly idx: number;

  /** 제목 */
  public readonly title: string;

  /** 내용 */
  public readonly contents: string;

  /** 활성화 시간 */
  public readonly activatedAt: Date | null;

  /** 고정 시간 */
  public readonly pinnedAt: Date | null;

  /** 생성 시간 */
  public readonly createdAt: Date;

  constructor(data: NoticeModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(notice: NoticeSelectField): NoticeModel {
    return new NoticeModel({
      idx: notice.idx,
      title: notice.title,
      contents: notice.contents,
      activatedAt: notice.activatedAt,
      pinnedAt: notice.pinnedAt,
      createdAt: notice.createdAt,
    });
  }
}
