import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapRepository } from './map.repository';
import { MapController } from './map.controller';
import { PrismaModule } from 'libs/modules';
import { CultureContentCoreModule } from 'libs/core/culture-content/culture-content-core.module';

@Module({
  imports: [PrismaModule, CultureContentCoreModule],
  controllers: [MapController],
  providers: [MapService, MapRepository],
})
export class MapModule {}
