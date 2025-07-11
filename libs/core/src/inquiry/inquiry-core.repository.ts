import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { InquirySelectField } from 'libs/core/inquiry/model/prisma/inquiry-select-field';
import { SummaryInquirySelectField } from 'libs/core/inquiry/model/prisma/summary-inquiry-select-field';
import { FindInquiryAllInput } from 'libs/core/inquiry/input/find-inquiry-all.input';
import { Prisma } from '@prisma/client';
import { InquiryType } from 'libs/core/inquiry/constant/inquiry-type';
import { CreateInquiryInput } from 'libs/core/inquiry/input/create-inquiry.input';
import { UpdateInquiryInput } from 'libs/core/inquiry/input/update-inquiry.input';

@Injectable()
export class InquiryCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT inquiry_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 문의 식별자
   */
  public async selectInquiryByIdx(
    idx: number,
  ): Promise<InquirySelectField | null> {
    return await this.txHost.tx.inquiry.findUnique({
      select: {
        idx: true,
        title: true,
        contents: true,
        createdAt: true,
        InquiryType: {
          select: {
            idx: true,
            name: true,
          },
        },
        InquiryImg: {
          select: {
            idx: true,
            imgPath: true,
            createdAt: true,
          },
          orderBy: { idx: 'asc' },
          where: { deletedAt: null },
        },
        User: {
          select: {
            idx: true,
            nickname: true,
            email: true,
            profileImgPath: true,
          },
        },
        Answer: {
          select: {
            idx: true,
            contents: true,
            createdAt: true,
            inquiryIdx: true,
          },
          orderBy: {
            idx: 'desc',
          },
          where: {
            deletedAt: null,
          },
        },
      },
      where: {
        idx,
        deletedAt: null,
        User: { deletedAt: null },
      },
    });
  }

  /**
   * SELECT inquiry_tb
   *
   * @author jochongs
   */
  public async selectInquiryAll({
    page,
    row,
    searchBy,
    search,
    typeIdx,
    answerState,
    user,
    orderBy = 'idx',
    order = 'desc',
  }: FindInquiryAllInput): Promise<SummaryInquirySelectField[]> {
    return await this.txHost.tx.inquiry.findMany({
      select: {
        idx: true,
        title: true,
        createdAt: true,
        InquiryType: {
          select: {
            idx: true,
            name: true,
          },
        },
        InquiryImg: {
          select: {
            idx: true,
            imgPath: true,
            createdAt: true,
          },
          orderBy: { idx: 'asc' },
          where: { deletedAt: null },
        },
        User: {
          select: {
            idx: true,
            nickname: true,
            email: true,
            profileImgPath: true,
          },
        },
        Answer: {
          select: {
            idx: true,
          },
          where: {
            deletedAt: null,
          },
        },
      },
      where: {
        AND: [
          {
            deletedAt: null,
            User: { deletedAt: null },
          },
          this.getSearchWhereClause(searchBy, search),
          this.getAnswerStateWhereClause(answerState),
          this.getTypeFilterWhereClause(typeIdx),
          this.getUserFilterWhereClause(user),
        ],
      },
      take: row,
      skip: (page - 1) * row,
      orderBy: {
        [this.getOrderByFieldName(orderBy)]: order,
      },
    });
  }

  private getOrderByFieldName(input: 'idx'): 'idx' {
    return 'idx';
  }

  private getSearchWhereClause(
    searchBy?: 'title' | 'nickname',
    search?: string,
  ): Prisma.InquiryWhereInput {
    if (!searchBy || search) {
      return {};
    }

    if (searchBy === 'title') {
      return {
        title: {
          contains: search,
        },
      };
    }

    // nickname
    return {
      User: {
        nickname: {
          contains: search,
        },
      },
    };
  }

  private getAnswerStateWhereClause(state?: boolean): Prisma.InquiryWhereInput {
    if (state === undefined) {
      return {};
    }

    if (state) {
      return {
        Answer: {
          some: {
            deletedAt: null,
          },
        },
      };
    }

    // false
    return {
      Answer: {
        none: {
          deletedAt: null,
        },
      },
    };
  }

  private getTypeFilterWhereClause(
    typeIdx?: InquiryType,
  ): Prisma.InquiryWhereInput {
    if (typeIdx === undefined) {
      return {};
    }

    return { typeIdx };
  }

  private getUserFilterWhereClause(userIdx?: number): Prisma.InquiryWhereInput {
    if (userIdx === undefined) {
      return {};
    }

    return { userIdx };
  }

  /**
   * INSERT INTO inquiry_tb
   *
   * @author jochongs
   *
   * @param userIdx 작성자 식별자
   */
  public async createInquiry(
    userIdx: number,
    input: CreateInquiryInput,
  ): Promise<InquirySelectField> {
    return await this.txHost.tx.inquiry.create({
      select: {
        idx: true,
        title: true,
        contents: true,
        createdAt: true,
        InquiryType: {
          select: {
            idx: true,
            name: true,
          },
        },
        InquiryImg: {
          select: {
            idx: true,
            imgPath: true,
            createdAt: true,
          },
          orderBy: { idx: 'asc' },
          where: { deletedAt: null },
        },
        User: {
          select: {
            idx: true,
            nickname: true,
            email: true,
            profileImgPath: true,
          },
        },
        Answer: {
          select: {
            idx: true,
            contents: true,
            createdAt: true,
            inquiryIdx: true,
          },
          orderBy: {
            idx: 'desc',
          },
          where: {
            deletedAt: null,
          },
        },
      },
      data: {
        title: input.title,
        contents: input.contents,
        InquiryImg: {
          createMany: {
            data: input.imgPathList.map((imgPath) => ({ imgPath })),
          },
        },
        typeIdx: input.typeIdx,
        userIdx,
      },
    });
  }

  /**
   * UPDATE inquiry WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 문의 식별자
   */
  public async updateInquiryIdx(
    idx: number,
    input: UpdateInquiryInput,
  ): Promise<void> {
    await this.txHost.tx.inquiry.update({
      data: {
        title: input.title,
        contents: input.contents,
        typeIdx: input.typeIdx,
        InquiryImg: input.imgPathList && {
          updateMany: { data: { deletedAt: new Date() }, where: {} },
          createMany: {
            data: input.imgPathList.map((imgPath) => ({ imgPath })),
          },
        },
      },
      where: { idx, deletedAt: null },
    });
  }

  /**
   * SOFT DELETE inquiry_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 문의 식별자
   */
  public async softDeleteInquiryByIdx(idx: number): Promise<void> {
    await this.txHost.tx.inquiry.update({
      where: { idx, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
