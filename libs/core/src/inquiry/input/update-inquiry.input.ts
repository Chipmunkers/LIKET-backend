import { PartialType, PickType } from '@nestjs/swagger';
import { CreateInquiryInput } from 'libs/core/inquiry/input/create-inquiry.input';

export class UpdateInquiryInput extends PartialType(
  PickType(CreateInquiryInput, ['typeIdx', 'title', 'contents', 'imgPathList']),
) {}
