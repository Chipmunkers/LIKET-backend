import { PickType } from '@nestjs/swagger';
import { SignUpDto } from './SignUpDto';

export class UpdatePwDto extends PickType(SignUpDto, ['pw']) {}
