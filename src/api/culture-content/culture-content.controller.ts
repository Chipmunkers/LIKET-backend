import { Controller } from '@nestjs/common';
import { CultureContentService } from './culture-content.service';

@Controller('culture-content')
export class CultureContentController {
  constructor(private readonly cultureContentService: CultureContentService) {}
}
