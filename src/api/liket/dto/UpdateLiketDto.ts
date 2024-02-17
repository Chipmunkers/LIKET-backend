import { PickType } from '@nestjs/swagger';
import { CreateLiketDto } from './CreateLiketDto';

export class UpdateLiketDto extends PickType(CreateLiketDto, ['description']) {}
