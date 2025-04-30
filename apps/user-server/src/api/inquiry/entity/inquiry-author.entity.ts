import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'apps/admin-server/src/api/user/entity/user.entity';
import { InquiryAuthorModel } from 'libs/core/inquiry/model/inquiry-author.model';

/**
 * @author jochongs
 */
export class InquiryAuthorEntity extends PickType(UserEntity, [
  'idx',
  'profileImgPath',
  'nickname',
]) {
  constructor(data: InquiryAuthorEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(authorModel: InquiryAuthorModel) {
    return new InquiryAuthorEntity({
      idx: authorModel.idx,
      nickname: authorModel.nickname,
      profileImgPath: authorModel.profileImgPath,
    });
  }
}
