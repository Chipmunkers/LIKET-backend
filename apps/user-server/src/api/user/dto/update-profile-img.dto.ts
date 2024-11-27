import { PickType } from '@nestjs/swagger';
import { UpdateProfileDto } from './update-profile.dto';

/**
 * @author jochongs
 */
export class UpdateProfileImgDto extends PickType(UpdateProfileDto, [
  'profileImg',
]) {}
