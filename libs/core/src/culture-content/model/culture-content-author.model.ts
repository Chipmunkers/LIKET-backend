import { PickType } from '@nestjs/swagger';
import { CultureContentAuthorSelectField } from 'libs/core/culture-content/model/prisma/culture-content-author-select-field';
import { UserModel } from 'libs/core/user/model/user.model';

/**
 * @author jochongs
 */
export class CultureContentAuthorModel extends PickType(UserModel, [
  'idx',
  'isAdmin',
  'email',
  'nickname',
  'profileImgPath',
]) {
  constructor(data: CultureContentAuthorModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    user: CultureContentAuthorSelectField,
  ): CultureContentAuthorModel {
    return new CultureContentAuthorModel({
      idx: user.idx,
      isAdmin: user.isAdmin,
      email: user.email,
      nickname: user.nickname,
      profileImgPath: user.profileImgPath,
    });
  }
}
