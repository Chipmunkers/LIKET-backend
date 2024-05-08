import { Tos } from '@prisma/client';

export class SummaryTosEntity {
  /**
   * 약관 인덱스
   *
   * @example 12
   */
  public idx: number;

  /**
   * 약관 제목
   *
   * @example "서비스 이용 약관"
   */
  public title: string;

  /**
   * 필수 동의 약관 여부
   *
   * @example true
   */
  public isEssential: boolean;

  constructor(data: SummaryTosEntity) {
    Object.assign(this, data);
  }

  static createEntity(data: Tos) {
    return new SummaryTosEntity({
      idx: data.idx,
      title: data.title,
      isEssential: data.isEssential,
    });
  }
}
