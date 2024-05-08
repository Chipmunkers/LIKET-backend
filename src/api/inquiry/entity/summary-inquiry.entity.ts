import { Prisma } from '@prisma/client';
import { InquiryTypeEntity } from './inquiry-type.entity';
import { UserProfileEntity } from '../../user/entity/user-profile.entity';

const InquiryWithInclude = Prisma.validator<Prisma.InquiryDefaultArgs>()({
  include: {
    Answer: true,
    InquiryType: true,
    InquiryImg: true,
    User: true,
  },
});

type InquiryWithInclude = Prisma.InquiryGetPayload<typeof InquiryWithInclude>;

export class SummaryInquiryEntity {
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

  constructor(data: SummaryInquiryEntity) {
    Object.assign(this, data);
  }

  static createEntity(inquiry: InquiryWithInclude) {
    return new SummaryInquiryEntity({
      idx: inquiry.idx,
      title: inquiry.title,
      type: InquiryTypeEntity.createEntity(inquiry.InquiryType),
      thumbnail: inquiry.InquiryImg[0]?.imgPath || null,
      author: {
        idx: inquiry.User.idx,
        profileImgPath: inquiry.User.profileImgPath,
        nickname: inquiry.User.nickname,
        provider: inquiry.User.provider,
      },
    });
  }
}
