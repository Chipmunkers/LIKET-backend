import { Prisma } from '@prisma/client';
import { InquiryTypeEntity } from './inquiry-type.entity';
import { InquiryEntity } from './inquiry.entity';
import { PickType } from '@nestjs/swagger';

const InquiryWithInclude = Prisma.validator<Prisma.InquiryDefaultArgs>()({
  include: {
    Answer: true,
    InquiryType: true,
    InquiryImg: true,
    User: true,
  },
});

type InquiryWithInclude = Prisma.InquiryGetPayload<typeof InquiryWithInclude>;

export class SummaryInquiryEntity extends PickType(InquiryEntity, [
  'idx',
  'title',
  'type',
  'thumbnail',
  'author',
  'createdAt',
]) {
  /**
   * 답변 상태
   *
   * @example true
   */
  public isAnswered: boolean;

  constructor(data: SummaryInquiryEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(inquiry: InquiryWithInclude) {
    return new SummaryInquiryEntity({
      idx: inquiry.idx,
      title: inquiry.title,
      type: InquiryTypeEntity.createEntity(inquiry.InquiryType),
      thumbnail: inquiry.InquiryImg[0]?.imgPath || null,
      isAnswered: !!inquiry.Answer[0],
      author: {
        idx: inquiry.User.idx,
        profileImgPath: inquiry.User.profileImgPath,
        nickname: inquiry.User.nickname,
        provider: inquiry.User.provider,
      },
      createdAt: inquiry.createdAt,
    });
  }
}
