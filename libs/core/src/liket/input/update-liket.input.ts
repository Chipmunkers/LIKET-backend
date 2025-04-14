import { PartialType } from '@nestjs/swagger';
import { CreateLiketInput } from 'libs/core/liket/input/create-liket.input';

/**
 * @author jochongs
 */
export class UpdateLiketInput extends PartialType(CreateLiketInput) {}
