import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryNotFoundException } from './exception/InquiryNotFoundException';
import { FILE_GROUPING } from '../upload/file-grouping';
import { InquiryEntity } from './entity/inquiry.entity';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get inquiry by idx
   */
  public getInquiryByIdx: (idx: number) => Promise<InquiryEntity> = async (
    idx,
  ) => {
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

    return InquiryEntity.createEntity(inquiry);
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
              imgPath: img,
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
