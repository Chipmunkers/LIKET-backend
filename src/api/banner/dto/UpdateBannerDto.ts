import { PickType } from '@nestjs/swagger';
import { CreateBannerDto } from './CreateBannerDto';

export class UpdateBannerDto extends PickType(CreateBannerDto, [
  'img',
  'link',
  'name',
]) {}
