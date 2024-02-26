import { ValidateNested } from 'class-validator';
import { UserEntity } from '../../entity/UserEntity';

export class GetUserAllForAdminDto {
  @ValidateNested()
  userList: UserEntity<'my', 'admin'>[];

  /**
   * total user count
   */
  count: number;
}
