import { Injectable } from '@nestjs/common';
import { MapRepository } from './map.repository';
import { MapPagerbleDto } from './dto/request/map-pagerble.dto';
import { LoginUser } from '../auth/model/login-user';
import { MapContentEntity } from './entity/map-content.entity';
import { MapContentPagerbleDto } from './dto/request/map-content-pagerble.dto';

@Injectable()
export class MapService {
  constructor(private readonly mapRepository: MapRepository) {}

  /**
   * @author jochongs
   */
  public async getClusteredContentsAllForMap(pagerble: MapPagerbleDto) {
    return await this.mapRepository.getContentCountFromMapLevel(
      pagerble,
      pagerble.level,
    );
  }

  /**
   * @author jochongs
   */
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
