import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { InquiryTypeEntity } from './entity/InquiryTypeEntity';

@Injectable()
export class InquiryTypeService {
  constructor(private readonly prisma: PrismaService) {}

  public getTypeAll: () => Promise<InquiryTypeEntity>;

  public getTypeByIdx: (idx: number) => Promise<InquiryTypeEntity>;
}
