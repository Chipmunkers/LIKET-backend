import { Prisma } from '@prisma/client';
import { AnswerEntity } from './answer.entity';
import { InquiryTypeEntity } from './inquiry-type.entity';
import { UserProfileEntity } from '../../user/entity/user-profile.entity';
import { InquiryModel } from 'libs/core/inquiry/model/inquiry.model';
import { InquiryAuthorModel } from 'libs/core/inquiry/model/inquiry-author.model';
import { InquiryAuthorEntity } from 'apps/user-server/src/api/inquiry/entity/inquiry-author.entity';

const inquiryWithInclude = Prisma.validator<Prisma.InquiryDefaultArgs>()({
  include: {
    Answer: true,
    InquiryType: true,
    InquiryImg: true,
    User: true,
  },
});

type InquiryWithInclude = Prisma.InquiryGetPayload<typeof inquiryWithInclude>;

/**
 * @author jochongs
 */
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
  public author: InquiryAuthorEntity;

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

  /**
   * 문의 작성일
   *
   * @example 2025-05-07T12:00:00.000Z
   */
  public createdAt: Date;

  constructor(data: InquiryEntity) {
    Object.assign(this, data);
  }

  /**
   * `InquiryCoreModule`이 개발됨에 따라 deprecated되었습니다.
   * 대신, `fromModel` 정적 메서드를 사용하십시오.
   *
   * @deprecated
   */
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
      },
      createdAt: inquiry.createdAt,
    });
  }

  public static fromModel(inquiryModel: InquiryModel): InquiryEntity {
    return new InquiryEntity({
      idx: inquiryModel.idx,
      title: inquiryModel.title,
      contents: inquiryModel.contents,
      type: InquiryTypeEntity.fromModel(inquiryModel.type),
      answerList: inquiryModel.answerList.map(AnswerEntity.fromModel),
      author: InquiryAuthorModel.fromModel(inquiryModel.author),
      imgList: inquiryModel.imgList.map(({ path }) => path),
      thumbnail: inquiryModel.imgList[0]?.path || null,
      createdAt: inquiryModel.createdAt,
    });
  }
}
