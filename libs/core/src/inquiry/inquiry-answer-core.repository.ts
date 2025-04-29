import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { InquiryAnswerSelectField } from 'libs/core/inquiry/model/prisma/inquiry-answer-select-field';
import { CreateInquiryAnswerInput } from 'libs/core/inquiry/input/create-inquiry-answer.input';
import { UpdateInquiryAnswerInput } from 'libs/core/inquiry/input/update-inquiry-answer.input';

@Injectable()
export class InquiryAnswerCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT answer_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 답변 식별자
   */
  public async selectAnswerByIdx(
    idx: number,
  ): Promise<InquiryAnswerSelectField | null> {
    return await this.txHost.tx.answer.findUnique({
      select: {
        idx: true,
        contents: true,
        createdAt: true,
        inquiryIdx: true,
      },
      where: {
        idx,
        deletedAt: null,
        Inquiry: { deletedAt: null, User: { deletedAt: null } },
      },
    });
  }

  /**
   * SELECT answer_tb WHERE inquiry_idx = $1
   *
   * @author jochongs
   *
   * @param inquiryIdx 문의 식별자
   */
  public async selectAnswerByInquiryIdx(
    inquiryIdx: number,
  ): Promise<InquiryAnswerSelectField[]> {
    return await this.txHost.tx.answer.findMany({
      select: {
        idx: true,
        contents: true,
        createdAt: true,
        inquiryIdx: true,
      },
      where: {
        inquiryIdx,
        deletedAt: null,
        Inquiry: { deletedAt: null, User: { deletedAt: null } },
      },
      orderBy: {
        idx: 'desc',
      },
    });
  }

  /**
   * INSERT answer_tb
   *
   * @author jochongs
   *
   * @param idx 문의 식별자
   * @param input 답변 생성
   */
  public async insertAnswer(
    inquiryIdx: number,
    input: CreateInquiryAnswerInput,
  ): Promise<InquiryAnswerSelectField> {
    return await this.txHost.tx.answer.create({
      select: {
        idx: true,
        contents: true,
        createdAt: true,
        inquiryIdx: true,
      },
      data: {
        idx: inquiryIdx,
        contents: input.contents,
      },
    });
  }

  /**
   * UPDATE answer_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 답변 식별자
   */
  public async updateAnswerByIdx(
    idx: number,
    input: UpdateInquiryAnswerInput,
  ): Promise<void> {
    await this.txHost.tx.answer.update({
      where: {
        idx,
        deletedAt: null,
        Inquiry: {
          deletedAt: null,
          User: { deletedAt: null },
        },
      },
      data: {
        contents: input.contents,
      },
    });
  }

  /**
   * SOFT DELETE answer_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 답변 식별자
   */
  public async deleteAnswerByIdx(idx: number): Promise<void> {
    await this.txHost.tx.answer.update({
      where: {
        idx,
        deletedAt: null,
        Inquiry: {
          deletedAt: null,
          User: { deletedAt: null },
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
