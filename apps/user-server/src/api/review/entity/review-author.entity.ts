import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'apps/admin-server/src/api/user/entity/user.entity';
import { ReviewAuthorModel } from 'libs/core/review/model/review-author.model';

/**
 * @author jochongs
 */
export class ReviewAuthorEntity extends PickType(UserEntity, [
  'idx',
  'profileImgPath',
  'nickname',
  'provider',
]) {
  constructor(data: ReviewAuthorEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: ReviewAuthorModel): ReviewAuthorEntity {
    return new ReviewAuthorEntity({
      idx: model.idx,
      profileImgPath: model.profileImgPath,
      nickname: model.nickname,
      provider: model.provider,
    });
  }
}
