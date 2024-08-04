import { Injectable } from '@nestjs/common';
import { MapRepository } from './map.repository';
import { MapPagerbleDto } from './dto/request/map-pagerble.dto';
import { LoginUser } from '../auth/model/login-user';
import { MapContentEntity } from './entity/map-content.entity';
import { MapContentPagerbleDto } from './dto/request/map-content-pagerble.dto';

@Injectable()
export class MapService {
  constructor(private readonly mapRepository: MapRepository) {}

  public async getClusteredContentsAllForMap(pagerble: MapPagerbleDto) {
    const clusteringLevel = this.getClusteringLevelFromScaleLevel(
      pagerble.level,
    );

    return await this.mapRepository.getContentCountFromMapLevel(
      pagerble,
      clusteringLevel,
    );
  }

  private getClusteringLevelFromScaleLevel(scaleLevel: number): 1 | 2 | 3 {
    if ([1, 2, 3, 4, 5, 6, 7, 8].includes(scaleLevel)) {
      return 3;
    }

    if ([9, 10].includes(scaleLevel)) {
      return 2;
    }

    return 1;
  }

  public async getContentAll(
    pagerbleDto: MapContentPagerbleDto,
    loginUser?: LoginUser,
  ) {
    const contentList = await this.mapRepository.getContentAllFromMap(
      pagerbleDto,
      loginUser,
    );

    return contentList.map((content) => MapContentEntity.createEntity(content));
  }
}
