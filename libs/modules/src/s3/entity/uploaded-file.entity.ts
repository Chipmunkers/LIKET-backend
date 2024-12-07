export class UploadedFileEntity {
  /**
   * URL
   *
   * @example "https://s3.ap-northeast-2.amazonaws.com/liket/culture-content/img_000001.png"
   */
  url: string;

  /**
   * 파일명
   *
   * @example img_000001.png
   */
  name: string;

  /**
   * 파일 확장자
   *
   * @example png
   */
  ext: string;

  /**
   * 파일경로
   *
   * @example /culture-content/img_000001.png
   */
  path: string;

  constructor(data: UploadedFileEntity) {
    Object.assign(this, data);
  }

  static create(data: UploadedFileEntity) {
    return new UploadedFileEntity(data);
  }
}
