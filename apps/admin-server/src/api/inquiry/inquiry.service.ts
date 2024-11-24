import { Injectable } from '@nestjs/common';
import { Prisma } from '../../common/prisma/prisma.service';
import { InquiryTypeEntity } from './entity/inquiry-type.entity';
import { InquiryPagerbleDto } from './dto/request/inquiry-pagerble.dto';
import { InquiryEntity } from './entity/inquiry.entity';
import { SummaryInquiryEntity } from './entity/summary-inquiry.entity';
import { CreateAnswerDto } from './dto/request/create-answer.dto';
import { UpdateAnswerDto } from './dto/request/update-answer.dto';
import { AnswerEntity } from './entity/answer.entity';
import { InquiryNotFoundException } from './exception/InquiryNotFoundException';
import { DuplicateAnswerException } from './exception/DuplicateAnswerException';
import { AnswerNotFoundException } from './exception/AnswerNotFoundException';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: Prisma) {}

  getInquiryTypeAll: () => Promise<{
    typeList: InquiryTypeEntity[];
  }> = async () => {
    const typeList = await this.prisma.inquiryType.findMany({
      orderBy: {
        idx: 'asc',
      },
    });

    return { typeList: typeList.map((type) => InquiryTypeEntity.createEntity(type)) };
  };

  getInquiryAll: (pagerble: InquiryPagerbleDto) => Promise<{
    inquiryList: SummaryInquiryEntity[];
    count: number;
  }> = async (pagerble) => {
    const [inquiryList, count] = await this.prisma.$transaction([
      this.prisma.inquiry.findMany({
        include: {
          Answer: {
            where: {
              deletedAt: null,
            },
          },
          InquiryImg: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              idx: 'asc',
            },
          },
          InquiryType: true,
          User: true,
        },
        where: {
          typeIdx: pagerble.type,
          Answer:
            pagerble.state !== undefined
              ? pagerble.state
                ? { some: {} }
                : { none: {} }
              : undefined,
          title:
            pagerble.searchby === 'title'
              ? {
                  contains: pagerble.search || '',
                }
              : undefined,
          deletedAt: null,
          User: {
            nickname:
              pagerble.searchby === 'nickname'
                ? {
                    contains: pagerble.search || '',
                  }
                : undefined,
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
          typeIdx: pagerble.type,
          Answer:
            pagerble.state !== undefined
              ? pagerble.state
                ? { some: {} }
                : { none: {} }
              : undefined,
          title:
            pagerble.searchby === 'title'
              ? {
                  contains: pagerble.search || '',
                }
              : undefined,
          deletedAt: null,
          User: {
            nickname:
              pagerble.searchby === 'nickname'
                ? {
                    contains: pagerble.search || '',
                  }
                : undefined,
            deletedAt: null,
          },
        },
      }),
    ]);

    return {
      inquiryList: inquiryList.map((inquiry) => InquiryEntity.createEntity(inquiry)),
      count,
    };
  };

  getInquiryByIdx: (idx: number) => Promise<InquiryEntity> = async (idx) => {
    const inquiry = await this.prisma.inquiry.findUnique({
      include: {
        Answer: {
          where: {
            deletedAt: null,
          },
        },
        InquiryImg: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'asc',
          },
        },
        InquiryType: true,
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

    return InquiryEntity.createEntity(inquiry);
  };

  createAnswerByInquiryIdx: (idx: number, createDto: CreateAnswerDto) => Promise<void> = async (
    idx,
    createDto,
  ) => {
    await this.prisma.$transaction(async (tx) => {
      const answer = await tx.answer.findFirst({
        where: {
          inquiryIdx: idx,
          deletedAt: null,
        },
      });

      if (answer) {
        throw new DuplicateAnswerException('This inquiry already has answer');
      }

      await tx.answer.create({
        data: {
          inquiryIdx: idx,
          contents: createDto.contents,
        },
      });
    });

    return;
  };

  getAnswerByIdx: (idx: number) => Promise<AnswerEntity> = async (idx) => {
    const answer = await this.prisma.answer.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!answer) {
      throw new AnswerNotFoundException('Cannot find answer');
    }

    return AnswerEntity.createEntity(answer);
  };

  updateAnswerByIdx: (idx: number, updateDto: UpdateAnswerDto) => Promise<void> = async (
    idx,
    updateDto,
  ) => {
    await this.prisma.answer.update({
      where: {
        idx,
      },
      data: {
        contents: updateDto.contents,
      },
    });

    return;
  };

  deleteAnswerByIdx: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.answer.update({
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
