/**
 * @author jochongs
 */
export class GetPerformException extends Error {
  errResponse: any;

  constructor(message: string, errResponse: any) {
    super(message);
    this.errResponse = errResponse;
  }
}
