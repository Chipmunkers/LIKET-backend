/**
 * @author jochongs
 */
export class InvalidPwError extends Error {
  constructor(message: string) {
    super(message);
  }
}
