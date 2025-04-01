import { Injectable } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryNotFoundException } from './exception/InquiryNotFoundException';
import { InquiryEntity } from './entity/inquiry.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { LoginUser } from '../auth/model/login-user';
import { PagerbleDto } from '../../common/dto/pagerble.dto';
import { SummaryInquiryEntity } from './entity/summary-inquiry.entity';
import { InquiryRepository } from './inquiry.repository';
import { InquiryCoreService } from 'libs/core/inquiry/inquiry-core.service';

@Injectable()
export class InquiryService {
  constructor(
    private readonly inquiryRepository: InquiryRepository,
    private readonly inquiryCoreService: InquiryCoreService,
    @Logger(InquiryService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 문의 목록 보기
   *
   * @author jochongs
   */
  public async getInquiryAllByLoginUser(
    loginUser: LoginUser,
    pagerble: PagerbleDto,
  ): Promise<{
    inquiryList: SummaryInquiryEntity[];
  }> {
    const inquiryList = await this.inquiryCoreService.findInquiryAll({
      page: pagerble.page,
      order: pagerble.order,
      orderBy: 'idx',
      user: loginUser.idx,
      row: 10,
    });

    return {
      inquiryList: inquiryList.map(SummaryInquiryEntity.fromModel),
    };
  }

  /**
   * 문의 자세히보기
   *
   * @author jochongs
   */
  public async getInquiryByIdx(idx: number): Promise<InquiryEntity> {
    const inquiry = await this.inquiryRepository.selectInquiryByIdx(idx);

    if (!inquiry) {
      this.logger.warn(
        this.getInquiryByIdx,
        'Attempt to find non-existent inquiry',
      );
      throw new InquiryNotFoundException('Cannot find inquiry');
    }

    return InquiryEntity.createEntity(inquiry);
  }

  /**
   * 문의 작성하기
   *
   * @author jochongs
   */
  public async createInquiry(
    userIdx: number,
    createDto: CreateInquiryDto,
  ): Promise<number> {
    const createdInquiry = await this.inquiryRepository.insertInquiry({
      title: createDto.title,
      contents: createDto.contents,
      userIdx,
      imgPathList: createDto.imgList,
      typeIdx: createDto.typeIdx,
    });

    return createdInquiry.idx;
  }

  /**
   * 문의 삭제하기
   *
   * @author jochongs
   */
  public async deleteInquiry(idx: number): Promise<void> {
    await this.inquiryRepository.deleteInquiryByIdx(idx);
  }
}
