import { PartialType, PickType } from '@nestjs/swagger';
import { CreateCultureContentLocationInput } from 'libs/core/culture-content/input/create-culture-content-location.input';

/**
 * @author jochongs
 */
export class UpdateCultureContentLocationInput extends PartialType(
  PickType(CreateCultureContentLocationInput, [
    'address',
    'detailAddress',
    'region1Depth',
    'region2Depth',
    'bCode',
    'hCode',
    'positionX',
    'positionY',
  ]),
) {}
