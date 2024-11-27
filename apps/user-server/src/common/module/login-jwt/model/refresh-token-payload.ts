/**
 * @author jochongs
 */
export class RefreshTokenPayload {
  public idx: number;
  public isAdmin: boolean;
  public type: 'Refresh';
  public exp?: number;
}
