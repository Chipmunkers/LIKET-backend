/**
 * @author jochongs
 */
export class GetRawContentException {
  err: any;
  id: string;

  /**
   * @param id perform id
   */
  constructor(id: string, err: any) {
    this.id = id;
    this.err = err;
  }
}
