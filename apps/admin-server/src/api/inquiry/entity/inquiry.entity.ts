import { Prisma } from '@prisma/client';
import { AnswerEntity } from './answer.entity';
import { InquiryTypeEntity } from './inquiry-type.entity';
import { SummaryInquiryEntity } from './summary-inquiry.entity';

const inquiryWithInclude = Prisma.validator<Prisma.InquiryDefaultArgs>()({
  include: {
    Answer: true,
    InquiryType: true,
    InquiryImg: true,
    User: true,
  },
});

type InquiryWithInclude = Prisma.InquiryGetPayload<typeof inquiryWithInclude>;

export class InquiryEntity extends SummaryInquiryEntity {
  /**
   * 문의 내용
   *
   * @example "안녕하세요. 성수 디올 팝업스토어 위치가 성동구가 아니라 성북구로 뜨는 오류를 확인했어요. 확인 후 수정 부탁드려요!"
   */
  public contents: string;

  /**
   * 문의 답변
   */
  public answer: AnswerEntity | null;

  constructor(data: InquiryEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(inquiry: InquiryWithInclude) {
    return new InquiryEntity({
      idx: inquiry.idx,
      title: inquiry.title,
      type: InquiryTypeEntity.createEntity(inquiry.InquiryType),
      imgList: inquiry.InquiryImg.map((img) => img.imgPath),
      author: {
        idx: inquiry.User.idx,
        nickname: inquiry.User.nickname,
        profileImgPath: inquiry.User.profileImgPath,
      },
      answerState: inquiry.Answer[0] ? true : false,
      contents: inquiry.contents,
      answer: inquiry.Answer[0] ? AnswerEntity.createEntity(inquiry.Answer[0]) : null,
      createdAt: inquiry.createdAt,
    });
  }
}
