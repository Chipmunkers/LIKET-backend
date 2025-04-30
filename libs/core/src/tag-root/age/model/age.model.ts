import { AgeSelectField } from 'libs/core/tag-root/age/model/prisma/age-select-field';

/**
 * @author jochongs
 */
export class AgeModel {
  /**
   * 연령대 식별자
   */
  public readonly idx: number;

  /**
   * 연령대 명
   */
  public readonly name: string;

  /**
   * 생성일
   */
  public readonly createdAt: Date;

  constructor(data: AgeModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(age: AgeSelectField): AgeModel {
    return new AgeModel({
      idx: age.idx,
      name: age.name,
      createdAt: age.createdAt,
    });
  }
}
