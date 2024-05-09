import { OmitType } from '@nestjs/swagger';
import { Tos } from '@prisma/client';
import { TosEntity } from './tos.entity';

export class SummaryTosEntity extends OmitType(TosEntity, [
  'contents',
] as const) {
  constructor(data: SummaryTosEntity) {
    super();
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
