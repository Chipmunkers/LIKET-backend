import { Controller } from '@nestjs/common';
import { LiketService } from './liket.service';

@Controller('liket')
export class LiketController {
  constructor(private readonly liketService: LiketService) {}
}
