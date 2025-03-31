import { Injectable } from '@nestjs/common';
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
}
