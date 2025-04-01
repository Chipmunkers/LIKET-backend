import { PickType } from '@nestjs/swagger';
import { InquiryAuthorSelectField } from 'libs/core/inquiry/model/prisma/inquiry-author-select-field';
import { UserModel } from 'libs/core/user/model/user.model';

/**
 * @author jochongs
 */
export class InquiryAuthorModel extends PickType(UserModel, [
  'idx',
  'nickname',
  'email',
  'profileImgPath',
]) {
  constructor(data: InquiryAuthorModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(user: InquiryAuthorSelectField): InquiryAuthorModel {
    return new InquiryAuthorModel({
      idx: user.idx,
      nickname: user.nickname,
      email: user.email,
      profileImgPath: user.profileImgPath,
    });
  }
}
