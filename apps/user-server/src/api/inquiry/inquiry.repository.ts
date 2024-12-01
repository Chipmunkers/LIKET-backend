import { Injectable } from '@nestjs/common';
import { PagerbleDto } from '../../common/dto/pagerble.dto';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { InsertInquiryDao } from './dao/insert-inquiry.dao';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class InquiryRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    @Logger(InquiryRepository.name) private readonly logger: LoggerService,
  ) {}

  /**
   * @author jochongs
   */
  public selectInquiryByUserIdx(userIdx: number, dao: PagerbleDto) {
    this.logger.log(
      this.selectInquiryByUserIdx,
      `SELECT inquiry WHERE user_idx = ${userIdx}`,
    );
    return this.prisma.inquiry.findMany({
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
      where: {
        userIdx,
        deletedAt: null,
      },
      skip: (dao.page - 1) * 10,
      take: 10,
      orderBy: {
        idx: dao.order,
      },
    });
  }

  /**
   * 더 이상, 개수를 세어 반환하지 않습니다. 따라서 deprecated 되었습니다.
   * 사용하지 마십시오.
   *
   * @author jochongs
   *
   * @deprecated
   */
  public selectInquiryCountByUserIdx(userIdx: number) {
    this.logger.log(this.selectInquiryCountByUserIdx, 'SELECT inquiry count');
    return this.prisma.inquiry.count({
      where: {
        deletedAt: null,
        userIdx,
      },
    });
  }

  /**
   * @author jochongs
   */
  public selectInquiryByIdx(idx: number) {
    this.logger.log(
      this.selectInquiryByIdx,
      `SELECT inquiry WHERE idx = ${idx}`,
    );
    return this.prisma.inquiry.findUnique({
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
      },
    });
  }

  /**
   * @author jochongs
   */
  public insertInquiry(dao: InsertInquiryDao) {
    this.logger.log(this.insertInquiry, 'INSERT inquiry');
    return this.prisma.inquiry.create({
      data: {
        title: dao.title,
        contents: dao.contents,
        userIdx: dao.userIdx,
        InquiryImg: {
          createMany: {
            data: dao.imgPathList.map((img) => ({
              imgPath: img,
            })),
          },
        },
        typeIdx: dao.typeIdx,
      },
    });
  }

  /**
   * @author jochongs
   */
  public deleteInquiryByIdx(idx: number) {
    this.logger.log(
      this.deleteInquiryByIdx,
      `SOFT DELETE inquiry WHERE idx = ${idx}`,
    );
    return this.prisma.inquiry.update({
      where: {
        idx,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
