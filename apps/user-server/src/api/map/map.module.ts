import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapRepository } from './map.repository';
import { MapController } from './map.controller';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  controllers: [MapController],
  providers: [MapService, MapRepository],
})
export class MapModule {}
