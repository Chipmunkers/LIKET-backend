import { PickType } from '@nestjs/swagger';
import { UpdateProfileDto } from './update-profile.dto';

export class UpdateProfileImgDto extends PickType(UpdateProfileDto, [
  'profileImg',
]) {}
