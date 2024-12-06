export class S3UploadException extends Error {
  err: any;
  constructor(message: string, err: any) {
    super(message);
    this.err = err;
  }
}
