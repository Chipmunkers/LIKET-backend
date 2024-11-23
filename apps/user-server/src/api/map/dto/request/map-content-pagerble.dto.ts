import { OmitType } from '@nestjs/swagger';
import { MapPagerbleDto } from './map-pagerble.dto';

export class MapContentPagerbleDto extends OmitType(MapPagerbleDto, [
  'level',
]) {}
