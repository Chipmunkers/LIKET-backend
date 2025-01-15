import { PedestrianRouteCoordinateEntity } from 'apps/user-server/src/api/address/entity/pedestrian-route-coordinate.entity';
import { CoordinateTuple } from 'libs/modules/sk-open-api/type/pedestrian-coordinate-tuple';
import { PedestrianFeature } from 'libs/modules/sk-open-api/type/pedestrian-feature';

/**
 * @author jochongs
 */
export class PedestrianRouteEntity {
  /**
   * Point인 경우 한 점, LineString인 경우
   *
   * @example "Point"
   */
  type: 'Point' | 'LineString';

  /**
   * type이 Point인 경우 반드시 배열에는 하나의 좌표 값만 들어갑니다.
   */
  coordinates: PedestrianRouteCoordinateEntity[];

  /**
   * 사용하지 마십시오. 아직 정의되지 않았습니다.
   *
   * TODO: 필요한 경우 타입을 정의하여 사용
   */
  properties: any;

  constructor(data: PedestrianRouteEntity) {
    Object.assign(this, data);
  }

  static createEntity(data: PedestrianFeature) {
    return new PedestrianRouteEntity({
      type: data.geometry.type,
      properties: data.properties,
      coordinates: PedestrianRouteEntity.isTupleArray(data.geometry.coordinates)
        ? data.geometry.coordinates.map((coordinate) =>
            PedestrianRouteCoordinateEntity.createEntity(coordinate),
          )
        : [
            PedestrianRouteCoordinateEntity.createEntity(
              data.geometry.coordinates,
            ),
          ],
    });
  }

  private static isTupleArray(
    data: CoordinateTuple | CoordinateTuple[],
  ): data is CoordinateTuple[] {
    return Array.isArray(data[0]);
  }
}
