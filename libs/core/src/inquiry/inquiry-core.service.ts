import { Injectable } from '@nestjs/common';
import { CreateInquiryInput } from 'libs/core/inquiry/input/create-inquiry.input';
import { FindInquiryAllInput } from 'libs/core/inquiry/input/find-inquiry-all.input';
import { UpdateInquiryInput } from 'libs/core/inquiry/input/update-inquiry.input';
import { InquiryCoreRepository } from 'libs/core/inquiry/inquiry-core.repository';
import { InquiryModel } from 'libs/core/inquiry/model/inquiry.model';
import { SummaryInquiryModel } from 'libs/core/inquiry/model/summary-inquiry.model';

@Injectable()
export class InquiryCoreService {
  constructor(private readonly inquiryCoreRepository: InquiryCoreRepository) {}

  /**
   * 문의 목록 불러오기
   *
   * @author jochongs
   */
  public async findInquiryAll(
    input: FindInquiryAllInput,
  ): Promise<SummaryInquiryModel[]> {
    return (await this.inquiryCoreRepository.selectInquiryAll(input)).map(
      SummaryInquiryModel.fromPrisma,
    );
  }

  /**
   * 식별자로 문의 찾기
   *
   * @author jochongs
   */
  public async findInquiryByIdx(idx: number): Promise<InquiryModel | null> {
    const inquiry = await this.inquiryCoreRepository.selectInquiryByIdx(idx);

    return inquiry && InquiryModel.fromPrisma(inquiry);
  }

  /**
   * 문의 생성하기
   *
   * @author jochongs
   *
   * @param userIdx 작성자 식별자
   */
  public async createInquiry(
    userIdx: number,
    input: CreateInquiryInput,
  ): Promise<InquiryModel> {
    return InquiryModel.fromPrisma(
      await this.inquiryCoreRepository.createInquiry(userIdx, input),
    );
  }

  /**
   * 문의 수정하기
   *
   * @author jochongs
   *
   * @param idx 문의 식별자
   */
  public async updateInquiryByIdx(
    idx: number,
    input: UpdateInquiryInput,
  ): Promise<void> {
    return await this.inquiryCoreRepository.updateInquiryIdx(idx, input);
  }
}
