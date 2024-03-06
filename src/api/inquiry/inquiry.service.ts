import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { InquiryListPagenationDto } from './dto/InquiryListPagenationDto';
import { InquiryEntity } from './entity/InquiryEntity';
import { CreateInquiryDto } from './dto/CreateInquiryDto';
import { InquiryNotFoundException } from './exception/InquiryNotFoundException';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  public getInquiryAll: (pagerble: InquiryListPagenationDto) => Promise<{
    count: number;
    inquiryList: InquiryEntity<'summary'>[];
  }> = async (pagerble) => {
    const [inquiryList, count] = await this.prisma.$transaction([
      this.prisma.inquiry.findMany({
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
          deletedAt: null,
          User: {
            deletedAt: null,
          },
        },
        orderBy: {
          idx: pagerble.order,
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
      this.prisma.inquiry.count({
        where: {
          deletedAt: null,
          User: {
            deletedAt: null,
          },
        },
      }),
    ]);

    return {
      inquiryList: inquiryList.map((inquiry) =>
        InquiryEntity.createSummaryInquiry(inquiry),
      ),
      count,
    };
  };

  public getInquiryByIdx: (idx: number) => Promise<InquiryEntity<'detail'>> =
    async (idx) => {
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
        throw new InquiryNotFoundException('Cannot find inquiry');
      }

      return InquiryEntity.createDetailInquiry(inquiry);
    };

  public createInquiry: (
    userIdx: number,
    createDto: CreateInquiryDto,
  ) => Promise<number> = async (userIdx, createDto) => {
    const createdInquiry = await this.prisma.inquiry.create({
      data: {
        title: createDto.title,
        contents: createDto.contents,
        InquiryImg: {
          createMany: {
            data: createDto.imgList.map((img) => ({
              imgPath: img.fileName,
            })),
          },
        },
        typeIdx: createDto.typeIdx,
      },
    });

    return createdInquiry.idx;
  };

  public deleteInquiry: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.inquiry.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  };
}
