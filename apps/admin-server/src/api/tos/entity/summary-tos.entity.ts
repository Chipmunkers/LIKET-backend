import { Tos } from '@prisma/client';

export class SummaryTosEntity {
  /**
   * 약관 인덱스
   *
   * @example 23
   */
  public idx: number;

  /**
   * 약관 제목
   *
   * @example "서비스 이용 약관"
   */
  public title: string;

  /**
   * 필수 약관 여부
   *
   * @example true
   */
  public isEssential: boolean;

  /**
   * 생성일
   *
   * @example 2024-02-10T00:00:00.000Z
   */
  public createdAt: Date;

  /**
   * 최근 수정일
   *
   * @example 2024-02-10T00:00:00.000Z
   */
  public updatedAt: Date;

  constructor(data: SummaryTosEntity) {
    Object.assign(this, data);
  }

  static createEntity(tos: Tos) {
    return new SummaryTosEntity({
      idx: tos.idx,
      title: tos.title,
      isEssential: tos.isEssential,
      createdAt: tos.createdAt,
      updatedAt: tos.updatedAt,
    });
  }
}
