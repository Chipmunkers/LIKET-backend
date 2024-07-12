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

@Injectable()
export class InquiryService {
  constructor(
    private readonly prisma: PrismaService,
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
    const where: Prisma.InquiryWhereInput = {
      userIdx: loginUser.idx,
      deletedAt: null,
    };

    this.logger.log(
      this.getInquiryAllByLoginUser,
      'SELECT inquiries and count',
    );
    const [inquiryList, count] = await this.prisma.$transaction([
      this.prisma.inquiry.findMany({
        include: {
          User: true,
          Answer: {
            where: {
              deletedAt: null,
            },
          },
          InquiryType: true,
          InquiryImg: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              idx: 'asc',
            },
          },
        },
        where,
        skip: (pagerble.page - 1) * 10,
        take: 10,
        orderBy: {
          idx: pagerble.order,
        },
      }),
      this.prisma.inquiry.count({ where }),
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
    this.logger.log(this.getInquiryByIdx, `SELECT inquiry ${idx}`);
    const inquiry = await this.prisma.inquiry.findUnique({
      include: {
        Answer: {
          where: {
            deletedAt: null,
          },
        },
        InquiryType: true,
        InquiryImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        User: true,
      },
      where: {
        idx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
    });

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
   * 문의 생서하기
   */
  public async createInquiry(
    userIdx: number,
    createDto: CreateInquiryDto,
  ): Promise<number> {
    this.logger.log(this.createInquiry, 'INSERT inquiry');
    const createdInquiry = await this.prisma.inquiry.create({
      data: {
        title: createDto.title,
        contents: createDto.contents,
        userIdx,
        InquiryImg: {
          createMany: {
            data: createDto.imgList.map((img) => ({
              imgPath: img,
            })),
          },
        },
        typeIdx: createDto.typeIdx,
      },
    });

    return createdInquiry.idx;
  }

  /**
   * 문의 삭제하기
   */
  public async deleteInquiry(idx: number): Promise<void> {
    this.logger.log(this.deleteInquiry, 'DELETE inquiry');
    await this.prisma.inquiry.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  }
}
