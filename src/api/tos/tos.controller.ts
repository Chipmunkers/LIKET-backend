import { Controller } from '@nestjs/common';
import { TosService } from './tos.service';

@Controller('tos')
export class TosController {
  constructor(private readonly tosService: TosService) {}
}
