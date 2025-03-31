import { Injectable } from '@nestjs/common';
import { CreateInquiryAnswerInput } from 'libs/core/inquiry/input/create-inquiry-answer.input';
import { UpdateInquiryAnswerInput } from 'libs/core/inquiry/input/update-inquiry-answer.input';
import { InquiryAnswerCoreRepository } from 'libs/core/inquiry/inquiry-answer-core.repository';
import { InquiryAnswerModel } from 'libs/core/inquiry/model/inquiry-answer.model';
import { InquiryModel } from 'libs/core/inquiry/model/inquiry.model';

@Injectable()
export class InquiryAnswerCoreService {
  constructor(
    private readonly inquiryAnswerCoreRepository: InquiryAnswerCoreRepository,
  ) {}

  /**
   * 답변 식별자로 답변 탐색하기
   *
   * @author jochongs
   *
   * @param idx 답변 식별자
   */
  public async findInquiryAnswerByIdx(
    idx: number,
  ): Promise<InquiryAnswerModel | null> {
    const answer =
      await this.inquiryAnswerCoreRepository.selectAnswerByIdx(idx);

    return answer && InquiryAnswerModel.fromPrisma(answer);
  }

  /**
   * 문의 식별자로 답변 탐색하기
   *
   * @author jochongs
   *
   * @param inquiryIdx 문의 식별자
   */
  public async findInquiryAnswerByInquiryIdx(
    inquiryIdx: number,
  ): Promise<InquiryAnswerModel[]> {
    return (
      await this.inquiryAnswerCoreRepository.selectAnswerByInquiryIdx(
        inquiryIdx,
      )
    ).map(InquiryAnswerModel.fromPrisma);
  }

  /**
   * 문의 답변 생성하기
   *
   * @author jochongs
   *
   * @param inquiryIdx 문의 식별자
   */
  public async createInquiryAnswer(
    inquiryIdx: number,
    input: CreateInquiryAnswerInput,
  ): Promise<InquiryAnswerModel> {
    return InquiryAnswerModel.fromPrisma(
      await this.inquiryAnswerCoreRepository.insertAnswer(inquiryIdx, input),
    );
  }

  /**
   * 문의 답변 수정하기
   *
   * @author jochongs
   *
   * @param idx 답변 식별자
   */
  public async updateInquiryAnswerByIdx(
    idx: number,
    input: UpdateInquiryAnswerInput,
  ): Promise<void> {
    return await this.inquiryAnswerCoreRepository.updateAnswerByIdx(idx, input);
  }

  /**
   * 문의 답변 삭제하기
   *
   * @author jochongs
   *
   * @param idx 답변 식별자
   */
  public async deleteInquiryAnswerByIdx(idx: number): Promise<void> {
    return await this.inquiryAnswerCoreRepository.deleteAnswerByIdx(idx);
  }
}
