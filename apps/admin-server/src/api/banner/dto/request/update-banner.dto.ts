import { PickType } from '@nestjs/swagger';
import { CreateBannerDto } from './create-banner.dto';

export class UpadteBannerDto extends PickType(CreateBannerDto, ['file', 'name', 'link'] as const) {}
