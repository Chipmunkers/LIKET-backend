import { PedestrianRouteEntity } from 'apps/user-server/src/api/address/entity/pedestrian-route.entity';

export class GetPedestrianRouteResponseDto {
  /**
   * 타입
   *
   * @example FeatureCollection
   */
  type: 'FeatureCollection';
  features: PedestrianRouteEntity[];
}
