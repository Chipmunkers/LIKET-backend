import { PickType } from '@nestjs/swagger';
import { CreateAnswerDto } from './CreateAnswerDto';

export class UpdateAnswerDto extends PickType(CreateAnswerDto, ['contents']) {}
