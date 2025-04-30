import { StyleSelectField } from 'libs/core/tag-root/style/model/prisma/style-select-field';

/**
 * @author jochongs
 */
export class StyleModel {
  /**
   * 스타일 식별자
   */
  public readonly idx: number;

  /**
   * 스타일 이름
   */
  public readonly name: string;

  /**
   * 생성일
   */
  public readonly createdAt: Date;

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
