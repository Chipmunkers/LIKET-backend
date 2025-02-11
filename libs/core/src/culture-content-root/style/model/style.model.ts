import { StyleSelectField } from 'libs/core/culture-content-root/style/model/prisma/style-select-field';

/**
 * @author jochongs
 */
export class StyleModel {
  /**
   * 스타일 식별자
   */
  idx: number;

  /**
   * 스타일 이름
   */
  name: string;

  /**
   * 생성일
   */
  createdAt: Date;

  constructor(data: StyleModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(style: StyleSelectField): StyleModel {
    return new StyleModel({
      idx: style.idx,
      name: style.name,
      createdAt: style.createdAt,
    });
  }
}
