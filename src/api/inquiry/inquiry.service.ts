import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryNotFoundException } from './exception/InquiryNotFoundException';
import { InquiryEntity } from './entity/inquiry.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { LoginUser } from '../auth/model/login-user';
import { PagerbleDto } from '../../common/dto/pagerble.dto';
import { SummaryInquiryEntity } from './entity/summary-inquiry.entity';
import { Prisma } from '@prisma/client';
import { InquiryRepository } from './inquiry.repository';

@Injectable()
export class InquiryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inquiryRepository: InquiryRepository,
    @Logger(InquiryService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 문의 목록 보기
   */
  public async getInquiryAllByLoginUser(
    loginUser: LoginUser,
    pagerble: PagerbleDto,
  ): Promise<{
    inquiryList: SummaryInquiryEntity[];
    count: number;
  }> {
    const [inquiryList, count] = await this.prisma.$transaction([
      this.inquiryRepository.selectInquiryByUserIdx(loginUser.idx, pagerble),
      this.inquiryRepository.selectInquiryCountByUserIdx(loginUser.idx),
    ]);

    return {
      inquiryList: inquiryList.map((inquiry) =>
        SummaryInquiryEntity.createEntity(inquiry),
      ),
      count,
    };
  }

  /**
   * 문의 자세히보기
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
   */
  public async deleteInquiry(idx: number): Promise<void> {
    await this.inquiryRepository.deleteInquiryByIdx(idx);
  }
}
