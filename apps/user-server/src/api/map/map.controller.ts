import { Controller, Get, Query } from '@nestjs/common';
import { MapService } from './map.service';
import { MapPagerbleDto } from './dto/request/map-pagerble.dto';
import { ClusteredContentAllResponseDto } from './dto/response/clustered-content-all.dto';
import { Exception } from '../../common/decorator/exception.decorator';
import { User } from '../user/user.decorator';
import { LoginUser } from '../auth/model/login-user';
import { ContentAllResponseDto } from './dto/response/content-all.dto';
import { ApiTags } from '@nestjs/swagger';
import { MapContentPagerbleDto } from './dto/request/map-content-pagerble.dto';

@Controller('map')
@ApiTags('Map Contents')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  /**
   * 클러스터링해서 데이터 가져오기
   *
   * @author jochongs
   */
  @Get('/culture-content/clustered/all')
  @Exception(400, 'Invalid querystring')
  async getClusteredContentAllForMap(
    @Query() pagerbleDto: MapPagerbleDto,
  ): Promise<ClusteredContentAllResponseDto> {
    return {
      clusteredContentList: await this.mapService.getClusteredContentsAllForMap(
        pagerbleDto,
      ),
    };
  }

  /**
   * 클러스터링 없이 데이터 가져오기
   *
   * @author jochongs
   */
  @Get('/culture-content/all')
  @Exception(400, 'Invalid querystring')
  async getCultureContentAllForMap(
    @Query() pagerbleDto: MapContentPagerbleDto,
    @User() loginUser?: LoginUser,
  ): Promise<ContentAllResponseDto> {
    return {
      contentList: await this.mapService.getContentAll(pagerbleDto, loginUser),
    };
  }
}
