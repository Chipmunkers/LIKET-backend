import { ValidateNested } from 'class-validator';
import { AnswerEntity } from './AnswerEntity';
import { Prisma } from '@prisma/client';
import { InquiryTypeEntity } from './InquiryTypeEntity';
import { UserProfileEntity } from '../../user/entity/UserProfileEntity';

const InquiryWithInclude = Prisma.validator<Prisma.InquiryDefaultArgs>()({
  include: {
    Answer: true,
    InquiryType: true,
    InquiryImg: true,
    User: true,
  },
});

type InquiryWithInclude = Prisma.InquiryGetPayload<typeof InquiryWithInclude>;

export class InquiryEntity<T extends 'summary' | 'detail' = 'summary'> {
  idx: number;
  title: string;
  contents: T extends 'detail' ? string : undefined;

  @ValidateNested()
  type: InquiryTypeEntity;

  @ValidateNested()
  answerList: T extends 'detail' ? AnswerEntity[] : undefined;

  imgList: T extends 'detail' ? string[] : undefined;
  thumbnail: string | null;

  @ValidateNested()
  author: UserProfileEntity;

  constructor(data: {
    idx: number;
    title: string;
    contents: T extends 'detail' ? string : undefined;
    type: InquiryTypeEntity;
    answerList: T extends 'detail' ? AnswerEntity[] : undefined;
    imgList: T extends 'detail' ? string[] : undefined;
    thumbnail: string | null;
    author: UserProfileEntity;
  }) {
    this.idx = data.idx;
    this.title = data.title;
    this.contents = data.contents;
    this.type = data.type;
    this.answerList = data.answerList;
    this.thumbnail = data.thumbnail;
  }

  static createSummaryInquiry(
    inquiry: InquiryWithInclude,
  ): InquiryEntity<'summary'> {
    return new InquiryEntity({
      idx: inquiry.idx,
      title: inquiry.title,
      type: InquiryTypeEntity.createInquiryType(inquiry.InquiryType),
      thumbnail: inquiry.InquiryImg[0]?.imgPath || null,
      contents: undefined,
      answerList: undefined,
      imgList: undefined,
      author: {
        idx: inquiry.User.idx,
        profileImgPath: inquiry.User.profileImgPath,
        nickname: inquiry.User.nickname,
        provider: inquiry.User.provider,
      },
    });
  }

  static createDetailInquiry(
    inquiry: InquiryWithInclude,
  ): InquiryEntity<'detail'> {
    return new InquiryEntity({
      idx: inquiry.idx,
      title: inquiry.title,
      contents: inquiry.contents,
      type: InquiryTypeEntity.createInquiryType(inquiry.InquiryType),
      answerList: inquiry.Answer.map((answer) =>
        AnswerEntity.createAnswer(answer),
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
