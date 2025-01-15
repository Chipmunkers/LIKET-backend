export class PedestrianProperty {
  /** 총 거리 (단위: meter) */
  totalDistance: number;

  /** 총 소요 시간 (단위: 초) */
  totalTime: number;

  /** 경로 순번 */
  index: number;

  /** 안내 지점의 노드 순번 */
  pointIndex: number;

  /** 안내 지점의 명칭 */
  name: string;

  /** 길 안내 정보 */
  description: string;

  /** 방면 명칭 */
  direction: string;

  /** 안내 지점 주변 관심 장소(POI)의 명칭 */
  nearPoiName: string;

  /** 안내 지점 주변 관심 장소(POI)의 X 좌표 */
  nearPoiX: string;

  /** 안내 지점 주변 관심 장소(POI)의 Y 좌표 */
  nearPoiY: string;

  /** 교차로 명칭 */
  intersectionName: string;

  /** 시설물 유형 정보 */
  facilityType: string;

  /** 시설물 명칭 */
  facilityName: string;

  /** 회전 정보 */
  turnType: number;

  /** 안내 지점 유형 */
  pointType: string; // "SP" | "EP" | "PP" | "GP"

  /** 구간 거리 (단위: meter) */
  distance: number;

  /** 구간 통과 시간 (단위: 초) */
  time: number;

  /** 도로 유형 정보 */
  roadType: number;

  /** 특화거리 정보 */
  categoryRoadType: number;
}
