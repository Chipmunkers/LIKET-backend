import { PickType, PartialType } from '@nestjs/swagger';
import { CreateCultureContentInput } from 'libs/core/culture-content/input/create-culture-content.input';
import { UpdateCultureContentLocationInput } from 'libs/core/culture-content/input/update-culture-content-location.input';

/**
 * @author jochongs
 */
export class UpdateCultureContentInput extends PartialType(
  PickType(CreateCultureContentInput, [
    'genreIdx',
    'styleIdxList',
    'ageIdx',
    'id',
    'title',
    'imgList',
    'description',
    'websiteLink',
    'startDate',
    'endDate',
    'openTime',
    'isFee',
    'isReservation',
    'isParking',
    'isPet',
    'imgList',
  ]),
) {
  public readonly location?: UpdateCultureContentLocationInput;
}
