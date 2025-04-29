import { faker } from '@faker-js/faker';
import { DeepRequired, getRandomValueFromConstant } from 'libs/common';
import { INQUIRY_TYPE } from 'libs/core/inquiry/constant/inquiry-type';
import { ISeedHelper } from 'libs/testing/interface/seed-helper.interface';
import { InquiryInput } from 'libs/testing/seed/inquiry/type/inquiry.input';
import { InquiryOutput } from 'libs/testing/seed/inquiry/type/inquiry.output';

/**
 * @author jochongs
 */
export class InquirySeedHelper extends ISeedHelper<
  InquiryInput,
  InquiryOutput
> {
  public async seed(input: InquiryInput): Promise<InquiryOutput> {
    const filledInput = await this.getFilledInputValue(input);
    const createdInquiry = await this.prisma.inquiry.create({
      include: {
        InquiryImg: true,
      },
      data: {
        userIdx: filledInput.userIdx,
        typeIdx: filledInput.typeIdx,
        title: filledInput.title,
        contents: filledInput.contents,
        deletedAt: filledInput.deletedAt,
        InquiryImg: {
          createMany: {
            data: filledInput.imgList.map((imgPath) => ({
              imgPath,
            })),
          },
        },
      },
    });

    return {
      idx: createdInquiry.idx,
      userIdx: createdInquiry.userIdx,
      typeIdx: createdInquiry.typeIdx,
      title: createdInquiry.title,
      contents: createdInquiry.contents,
      deletedAt: createdInquiry.deletedAt,
      imgList: createdInquiry.InquiryImg.map((img) => img.imgPath),
    };
  }

  private async getFilledInputValue(
    input: InquiryInput,
  ): Promise<DeepRequired<InquiryInput>> {
    return {
      userIdx: input.userIdx,
      title: input.title ?? faker.lorem.slug(3),
      typeIdx: input.typeIdx ?? this.getRandomTypeIdx(),
      imgList: input.imgList ?? this.getRandomImgList(),
      contents: input.contents ?? faker.lorem.sentences(5, '\n'),
      deletedAt: input.deletedAt ?? null,
    };
  }

  private getRandomImgList(): string[] {
    const randomCount = Math.floor(Math.random() * 11) - 1; // 0 ~ 10

    return Array.from({ length: randomCount }).map(
      () => `/inquiry/${faker.lorem.word()}.png`,
    );
  }

  private getRandomTypeIdx() {
    return getRandomValueFromConstant(INQUIRY_TYPE);
  }
}
