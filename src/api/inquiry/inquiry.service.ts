import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { InquiryListPagenationDto } from './dto/InquiryListPagenationDto';
import { InquiryEntity } from './entity/InquiryEntity';
import { CreateInquiryDto } from './dto/CreateInquiryDto';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  public getInquiryAll: (pagerble: InquiryListPagenationDto) => Promise<{
    count: number;
    inquiryList: InquiryEntity<'summary'>;
  }>;

  public getInquiryByIdx: (idx: number) => Promise<InquiryEntity<'detail'>>;

  public createInquiry: (
    userIdx: number,
    createDto: CreateInquiryDto,
  ) => Promise<number>;

  public deleteInquiry: (idx: number) => Promise<void>;
}
