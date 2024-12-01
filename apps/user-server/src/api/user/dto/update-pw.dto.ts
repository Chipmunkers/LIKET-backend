import { PickType } from '@nestjs/swagger';
import { SignUpDto } from './sign-up.dto';

/**
 * @author jochongs
 */
export class UpdatePwDto extends PickType(SignUpDto, ['pw']) {}
