import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { InquiryTypeEntity } from './entity/InquiryTypeEntity';
import { InquiryTypeNotFoundException } from './exception/InquiryTypeNotFoundException';

@Injectable()
export class InquiryTypeService {
  constructor(private readonly prisma: PrismaService) {}

  public getTypeAll: () => Promise<InquiryTypeEntity[]> = async () => {
    const typeList = await this.prisma.inquiryType.findMany({
      select: {
        idx: true,
        name: true,
        createdAt: true,
      },
    });

    return typeList.map((type) => InquiryTypeEntity.createInquiryType(type));
  };

  public getTypeByIdx: (idx: number) => Promise<InquiryTypeEntity> = async (
    idx,
  ) => {
    const type = await this.prisma.inquiryType.findUnique({
      select: {
        idx: true,
        name: true,
        createdAt: true,
      },
      where: {
        idx,
      },
    });

    if (!type) {
      throw new InquiryTypeNotFoundException('Cannot find inquiry type');
    }

    return InquiryTypeEntity.createInquiryType(type);
  };
}
