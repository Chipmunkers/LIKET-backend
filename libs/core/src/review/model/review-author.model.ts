import { PickType } from '@nestjs/swagger';
import { ReviewAuthorSelectField } from 'libs/core/review/model/prisma/review-author-select-field';
import { UserModel } from 'libs/core/user/model/user.model';

/**
 * @author jochongs
 */
export class ReviewAuthorModel extends PickType(UserModel, [
  'idx',
  'profileImgPath',
  'nickname',
  'provider',
  'isAdmin',
]) {
  constructor(data: ReviewAuthorModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(user: ReviewAuthorSelectField): ReviewAuthorModel {
    return new ReviewAuthorModel({
      idx: user.idx,
      isAdmin: user.isAdmin,
      nickname: user.nickname,
      provider: user.provider,
      profileImgPath: user.profileImgPath,
    });
  }
}
