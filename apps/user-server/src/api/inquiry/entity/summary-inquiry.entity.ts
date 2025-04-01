import { Prisma } from '@prisma/client';
import { InquiryTypeEntity } from './inquiry-type.entity';
import { InquiryEntity } from './inquiry.entity';
import { PickType } from '@nestjs/swagger';
import { SummaryInquiryModel } from 'libs/core/inquiry/model/summary-inquiry.model';
import { InquiryAuthorEntity } from 'apps/user-server/src/api/inquiry/entity/inquiry-author.entity';

const InquiryWithInclude = Prisma.validator<Prisma.InquiryDefaultArgs>()({
  include: {
    Answer: true,
    InquiryType: true,
    InquiryImg: true,
    User: true,
  },
});

type InquiryWithInclude = Prisma.InquiryGetPayload<typeof InquiryWithInclude>;

/**
 * @author jochongs
 */
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

  /**
   * `InquiryCoreModule`이 개발됨에 따라 deprecated되었습니다.
   * 대신, `fromModel` 정적 메서드를 사용하십시오.
   *
   * @deprecated
   */
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
      },
      createdAt: inquiry.createdAt,
    });
  }

  public static fromModel(
    inquiryModel: SummaryInquiryModel,
  ): SummaryInquiryEntity {
    return new SummaryInquiryEntity({
      idx: inquiryModel.idx,
      title: inquiryModel.title,
      type: InquiryTypeEntity.fromModel(inquiryModel.type),
      author: InquiryAuthorEntity.fromModel(inquiryModel.author),
      thumbnail: inquiryModel.imgList[0]?.path || null,
      createdAt: inquiryModel.createdAt,
      isAnswered: inquiryModel.answerState,
    });
  }
}
