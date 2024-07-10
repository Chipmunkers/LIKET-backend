import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { InquiryTypeEntity } from './entity/inquiry-type.entity';
import { InquiryTypeNotFoundException } from './exception/InquiryTypeNotFoundException';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class InquiryTypeService {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(InquiryTypeService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 문의 유형 모두 가져오기
   */
  public async getTypeAll(): Promise<InquiryTypeEntity[]> {
    this.logger.log(this.getTypeAll, 'SELECT inquiries');
    const typeList = await this.prisma.inquiryType.findMany({
      select: {
        idx: true,
        name: true,
        createdAt: true,
      },
    });

    return typeList.map((type) => InquiryTypeEntity.createEntity(type));
  }

  /**
   * 문의 유형 자세히보기
   */
  public async getTypeByIdx(idx: number): Promise<InquiryTypeEntity> {
    this.logger.log(this.getTypeByIdx, `SELECT inquiry type ${idx}`);
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
      this.logger.warn(
        this.getTypeByIdx,
        'Attempt to find non-existent inquiry type',
      );
      throw new InquiryTypeNotFoundException('Cannot find inquiry type');
    }

    return InquiryTypeEntity.createEntity(type);
  }
}
