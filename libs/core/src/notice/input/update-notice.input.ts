import { PartialType, PickType } from '@nestjs/swagger';
import { CreateNoticeInput } from 'libs/core/notice/input/create-notice.input';

/**
 * @author jochongs
 */
export class UpdateNoticeInput extends PartialType(
  PickType(CreateNoticeInput, ['title', 'contents']),
) {}
