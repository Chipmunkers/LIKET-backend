/**
 * @author jochongs
 */
export class FailToGetPedestrianRoutes extends Error {
  public readonly code: number;

  constructor(message: string, code: number | string) {
    super(message);
    this.code = Number(code);
  }
}
