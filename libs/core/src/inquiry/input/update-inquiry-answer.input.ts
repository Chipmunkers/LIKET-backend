import { PartialType, PickType } from '@nestjs/swagger';
import { CreateInquiryAnswerInput } from 'libs/core/inquiry/input/create-inquiry-answer.input';

export class UpdateInquiryAnswerInput extends PartialType(
  PickType(CreateInquiryAnswerInput, ['contents']),
) {}
