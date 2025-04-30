import { PickType } from '@nestjs/swagger';
import { CreateBannerDto } from './create-banner.dto';

export class UpdateBannerDto extends PickType(CreateBannerDto, [
  'file',
  'name',
  'link',
] as const) {}
