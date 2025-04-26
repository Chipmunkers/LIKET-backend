import { PickType } from '@nestjs/swagger';
import { SummaryTosSelectField } from 'libs/core/tos/model/prisma/summary-tos-select-field';
import { TosModel } from 'libs/core/tos/model/tos.model';

export class SummaryTosModel extends PickType(TosModel, [
  'idx',
  'title',
  'isEssential',
  'createdAt',
  'updatedAt',
] as const) {
  constructor(data: SummaryTosModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(tos: SummaryTosSelectField): SummaryTosModel {
    return new SummaryTosModel({
      idx: tos.idx,
      title: tos.title,
      isEssential: tos.isEssential,
      createdAt: tos.createdAt,
      updatedAt: tos.updatedAt,
    });
  }
}
