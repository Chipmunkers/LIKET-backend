import { Injectable } from '@nestjs/common';
import { MapRepository } from './map.repository';
import { MapPagerbleDto } from './dto/request/map-pagerble.dto';
import { LoginUser } from '../auth/model/login-user';
import { MapContentEntity } from './entity/map-content.entity';
import { MapContentPagerbleDto } from './dto/request/map-content-pagerble.dto';
import { CultureContentCoreService } from 'libs/core/culture-content/culture-content-core.service';

@Injectable()
export class MapService {
  constructor(
    private readonly mapRepository: MapRepository,
    private readonly cultureContentCoreService: CultureContentCoreService,
  ) {}

  /**
   * 클러스터링 레벨에 따라 활성화된 컨텐츠 개수를 가져오는 메서드
   * !주의: 이 API는 deprecated 되었습니다. 대신 getContentAll 메서드만 사용하십시오.
   *
   * @deprecated
   *
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
    const contentList =
      await this.cultureContentCoreService.findCultureContentAll(
        {
          page: 1,
          row: 100000,
          accept: true,
          ageList: pagerbleDto.age ? [pagerbleDto.age] : [],
          styleList: pagerbleDto.styles,
          genreList: pagerbleDto.genre ? [pagerbleDto.genre] : [],
          coordinateRange: {
            bottomX: pagerbleDto['bottom-x'],
            bottomY: pagerbleDto['bottom-y'],
            topX: pagerbleDto['top-x'],
            topY: pagerbleDto['top-y'],
          },
          open: ['continue'],
        },
        loginUser?.idx,
      );

    return contentList.map(MapContentEntity.fromModel);
  }
}
