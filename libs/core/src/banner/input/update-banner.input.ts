import { PartialType } from '@nestjs/swagger';
import { CreateBannerInput } from 'libs/core/banner/input/create-banner.input';

/**
 * @author jochongs
 */
export class UpdateBannerInput extends PartialType(CreateBannerInput) {}
