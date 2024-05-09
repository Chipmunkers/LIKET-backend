import { OmitType } from '@nestjs/swagger';
import { LocationEntity } from './location.entity';

export class CreateLocationDto extends LocationEntity {}
