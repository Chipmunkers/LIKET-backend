export class KeyLimitExceedException extends Error {
  constructor(message: string) {
    super(message);
  }
}
