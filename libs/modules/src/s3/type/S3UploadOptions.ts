/**
 * @author jochongs
 */
export class S3UploadOptions {
  /**
   * 파일명
   *
   * @example img_000001.png
   */
  filename: string;

  /**
   * 파일 경로
   * 루트 경로에 파일을 저장하는 것은 금지합니다.
   *
   * @example culture_content
   */
  path: string;
}
