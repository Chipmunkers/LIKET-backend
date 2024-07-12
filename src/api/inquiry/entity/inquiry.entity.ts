import { Prisma } from '@prisma/client';
import { AnswerEntity } from './answer.entity';
import { InquiryTypeEntity } from './inquiry-type.entity';
import { SummaryInquiryEntity } from './summary-inquiry.entity';
import { UserProfileEntity } from '../../user/entity/user-profile.entity';

const inquiryWithInclude = Prisma.validator<Prisma.InquiryDefaultArgs>()({
  include: {
    Answer: true,
    InquiryType: true,
    InquiryImg: true,
    User: true,
  },
});

type InquiryWithInclude = Prisma.InquiryGetPayload<typeof inquiryWithInclude>;

export class InquiryEntity {
  /**
   * 문의 인덱스
   *
   * @example 1
   */
  public idx: number;

  /**
   * 문의 제목
   *
   * @example "회원가입 서비스 문의"
   */
  public title: string;

  /**
   * 문의 유형
   */
  public type: InquiryTypeEntity;

  /**
   * 문의 썸네일
   *
   * @example "/inquiry/img_000001.png"
   */
  public thumbnail: string | null;

  /**
   * 문의 작성자
   */
  public author: UserProfileEntity;

  /**
   * 내용
   *
   * @example "서비스 내용이 이상한 것 같습니다. 확인좀 부탁드립니다."
   */
  public contents: string;

  /**
   * 답변 목록
   */
  public answerList: AnswerEntity[];

  /**
   * 문의 목록
   */
  public imgList: string[];

  constructor(data: InquiryEntity) {
    Object.assign(this, data);
  }

  static createEntity(inquiry: InquiryWithInclude) {
    return new InquiryEntity({
      idx: inquiry.idx,
      title: inquiry.title,
      contents: inquiry.contents,
      type: InquiryTypeEntity.createEntity(inquiry.InquiryType),
      answerList: inquiry.Answer.map((answer) =>
        AnswerEntity.createEntity(answer),
      ),
      thumbnail: inquiry.InquiryImg[0]?.imgPath || null,
      imgList: inquiry.InquiryImg.map((img) => img.imgPath),
      author: {
        idx: inquiry.User.idx,
        profileImgPath: inquiry.User.profileImgPath,
        nickname: inquiry.User.nickname,
        provider: inquiry.User.provider,
      },
    });
  }
}
