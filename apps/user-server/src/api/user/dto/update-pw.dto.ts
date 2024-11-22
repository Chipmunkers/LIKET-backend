import { PickType } from '@nestjs/swagger';
import { SignUpDto } from './sign-up.dto';

export class UpdatePwDto extends PickType(SignUpDto, ['pw']) {}
