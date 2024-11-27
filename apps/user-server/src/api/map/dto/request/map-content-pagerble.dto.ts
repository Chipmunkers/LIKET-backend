import { OmitType } from '@nestjs/swagger';
import { MapPagerbleDto } from './map-pagerble.dto';

/**
 * @author jochongs
 */
export class MapContentPagerbleDto extends OmitType(MapPagerbleDto, [
  'level',
]) {}
