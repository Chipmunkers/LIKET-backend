/**
 * @author jochongs
 */
export class PedestrianRouteCoordinateEntity {
  /**
   * X 좌표
   *
   * @example 127.032
   */
  x: number;

  /**
   * Y 좌표
   *
   * @example 37.27812042
   */
  y: number;

  constructor(data: PedestrianRouteCoordinateEntity) {
    Object.assign(this, data);
  }

  static createEntity(coordinate: [number, number]) {
    return new PedestrianRouteCoordinateEntity({
      x: coordinate[0],
      y: coordinate[1],
    });
  }
}
