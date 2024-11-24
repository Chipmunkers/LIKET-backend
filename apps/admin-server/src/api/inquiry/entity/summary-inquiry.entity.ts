import { PickType } from '@nestjs/swagger';
import { InquiryTypeEntity } from './inquiry-type.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { Prisma } from '@prisma/client';

const inquiryWithInclude = Prisma.validator<Prisma.InquiryDefaultArgs>()({
  include: {
    Answer: true,
    InquiryType: true,
    InquiryImg: true,
    User: true,
  },
});

type InquiryWithInclude = Prisma.InquiryGetPayload<typeof inquiryWithInclude>;

class InquiryAuthor extends PickType(UserEntity, ['idx', 'nickname', 'profileImgPath'] as const) {}

export class SummaryInquiryEntity {
  /**
   * 문의 인덱스
   *
   * @example 12
   */
  public idx: number;

  /**
   * 문의 제목
   *
   * @example "라이켓 스티커가 더 다양했으면 좋겠어요."
   */
  public title: string;

  /**
   * 문의 유형
   */
  public type: InquiryTypeEntity;

  /**
   * 문의 이미지
   *
   * @example ["https://s3.ap-northeast-02.liket/inquiry/img_112233.png"]
   */
  public imgList: string[];

  /**
   * 작성자
   */
  public author: InquiryAuthor;

  /**
   * 답변 상태
   *
   * @example true
   */
  public answerState: boolean;

  /**
   * 문의 생성일
   *
   * @example 2024-05-05T10:10:10.000Z
   */
  public createdAt: Date;

  constructor(data: SummaryInquiryEntity) {
    Object.assign(this, data);
  }

  static createEntity(inquiry: InquiryWithInclude) {
    return new SummaryInquiryEntity({
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
      createdAt: inquiry.createdAt,
    });
  }
}
