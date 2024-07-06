import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class NicknameDuplicateCheckDto extends PickType(UserEntity, [
  'nickname',
] as const) {}
