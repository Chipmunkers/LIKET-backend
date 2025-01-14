import { CoordinateTuple } from 'libs/modules/sk-open-api/type/pedestrian-coordinate-tuple';

/**
 * @author jochongs
 */
export class PedestrianGeometry {
  /** 형상 정보 타입 */
  type: 'Point' | 'LineString';

  /** 좌표 정보 */
  coordinates: CoordinateTuple | CoordinateTuple[];
}
