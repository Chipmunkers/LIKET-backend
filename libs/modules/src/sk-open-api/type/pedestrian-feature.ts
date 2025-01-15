import { PedestrianGeometry } from 'libs/modules/sk-open-api/type/pedestrian-geometry';
import { PedestrianProperty } from 'libs/modules/sk-open-api/type/pedestrian-property';

/**
 * @author jochongs
 */
export class PedestrianFeature {
  /** GeoJSON 형상 정보 타입 */
  type: 'Feature';

  /** GeoJSON 표준 규격의 형상 정보 */
  geometry: PedestrianGeometry;

  /** 길 안내 사용자 정의 프로퍼티 */
  properties: PedestrianProperty;
}
