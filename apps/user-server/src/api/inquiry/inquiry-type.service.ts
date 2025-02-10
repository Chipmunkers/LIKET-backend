import { Injectable } from '@nestjs/common';
import { InquiryTypeEntity } from './entity/inquiry-type.entity';
import { InquiryTypeNotFoundException } from './exception/InquiryTypeNotFoundException';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { InquiryTypeRepository } from './inquiry-type.repository';

@Injectable()
export class InquiryTypeService {
  constructor(
    private readonly inquiryTypeRepository: InquiryTypeRepository,
    @Logger(InquiryTypeService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 문의 유형 모두 가져오기
   *
   * @author jochongs
   */
  public async getTypeAll(): Promise<InquiryTypeEntity[]> {
    const typeList = await this.inquiryTypeRepository.selectInquiryTypeAll();

    return typeList.map((type) => InquiryTypeEntity.createEntity(type));
  }

  /**
   * 문의 유형 자세히보기
   *
   * @author jochongs
   */
  public async getTypeByIdx(idx: number): Promise<InquiryTypeEntity> {
    const type = await this.inquiryTypeRepository.selectInquiryByIdx(idx);

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
