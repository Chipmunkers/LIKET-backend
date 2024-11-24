export class UploadFileEntity {
  /**
   * 파일 경로
   *
   * @example https://s3.northeast-2.amazonaws.com/liket/img/banner_123123.png
   */
  fullUrl: string;

  /**
   * 파일 이름
   *
   * @example banner_123123.png
   */
  fileName: string;

  /**
   * 파일 확장자
   *
   * @example png
   */
  fileExt: string;

  /**
   * 파일 경로
   *
   * @example /img/banner_123.png
   */
  filePath: string;
}
