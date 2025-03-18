import { PartialType } from '@nestjs/swagger';
import { CreateBannerInput } from 'libs/core/banner/input/create-banner.input';

/**
 * @author jochongs
 */
export class BannerUpdateInput extends PartialType(CreateBannerInput) {}
