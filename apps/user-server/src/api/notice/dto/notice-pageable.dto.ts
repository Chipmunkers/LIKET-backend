import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';

/**
 * @author jochongs
 */
export class NoticePageableDto extends PickType(PagerbleDto, ['page']) {}
