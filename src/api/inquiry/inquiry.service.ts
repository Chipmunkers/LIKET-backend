import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InquiryListPagenationDto } from './dto/InquiryListPagenationDto';
import { InquiryEntity } from './entity/InquiryEntity';
import { CreateInquiryDto } from './dto/CreateInquiryDto';
import { InquiryNotFoundException } from './exception/InquiryNotFoundException';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all inquiries for admin user
   */
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

  /**
   * Get inquiry by idx
   */
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

  /**
   * Create inquiry with user idx
   */
  public createInquiry: (
    userIdx: number,
    createDto: CreateInquiryDto,
  ) => Promise<number> = async (userIdx, createDto) => {
    const createdInquiry = await this.prisma.inquiry.create({
      data: {
        title: createDto.title,
        contents: createDto.contents,
        userIdx,
        InquiryImg: {
          createMany: {
            data: createDto.imgList.map((img) => ({
              imgPath: img.filePath,
            })),
          },
        },
        typeIdx: createDto.typeIdx,
      },
    });

    return createdInquiry.idx;
  };

  /**
   * Delete inquiry by idx
   */
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
