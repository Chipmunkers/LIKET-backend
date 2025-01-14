/**
 * @author jochongs
 */
export class FailToGetPedestrianRoutes extends Error {
  constructor(message: string, code: number) {
    super(message);
  }
}
