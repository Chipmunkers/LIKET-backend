import { PickType } from '@nestjs/swagger';
import { LiketAuthorProfileField } from 'libs/core/liket/model/prisma/liket-author-select-field';
import { UserModel } from 'libs/core/user/model/user.model';

/**
 * @author jochongs
 */
export class LiketAuthorModel extends PickType(UserModel, [
  'idx',
  'profileImgPath',
  'nickname',
  'provider',
]) {
  constructor(data: LiketAuthorModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(user: LiketAuthorProfileField): LiketAuthorModel {
    return new LiketAuthorModel({
      idx: user.idx,
      profileImgPath: user.profileImgPath,
      provider: user.provider,
      nickname: user.nickname,
    });
  }
}
