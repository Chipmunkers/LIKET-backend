import { PickType } from '@nestjs/swagger';
import { NoticeEntity } from '../../entity/notice.entity';

export class CreateNoticeDto extends PickType(NoticeEntity, ['title', 'contents']) {}
