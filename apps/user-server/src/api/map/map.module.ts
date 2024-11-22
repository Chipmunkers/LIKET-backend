import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { MapService } from './map.service';
import { MapRepository } from './map.repository';
import { MapController } from './map.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MapController],
  providers: [MapService, MapRepository],
})
export class MapModule {}
