import { PartialType, PickType } from '@nestjs/swagger';
import { CreateTosInput } from 'libs/core/tos/input/create-tos.input';

/**
 * @author jochongs
 */
export class UpdateTosInput extends PartialType(
  PickType(CreateTosInput, ['title', 'contents', 'isEssential'] as const),
) {}
