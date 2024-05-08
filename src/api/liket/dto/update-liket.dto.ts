import { PickType } from '@nestjs/swagger';
import { CreateLiketDto } from './create-liket.dto';

export class UpdateLiketDto extends PickType(CreateLiketDto, ['description']) {}
