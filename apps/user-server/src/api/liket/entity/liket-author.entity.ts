import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'apps/admin-server/src/api/user/entity/user.entity';
import { LiketAuthorModel } from 'libs/core/liket/model/liket-author.model';

/**
 * @author jochongs
 */
export class LiketAuthorEntity extends PickType(UserEntity, [
  'idx',
  'profileImgPath',
  'nickname',
  'provider',
] as const) {
  constructor(data: LiketAuthorEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: LiketAuthorModel): LiketAuthorEntity {
    return new LiketAuthorEntity({
      idx: model.idx,
      profileImgPath: model.profileImgPath,
      nickname: model.nickname,
      provider: model.provider,
    });
  }
}
