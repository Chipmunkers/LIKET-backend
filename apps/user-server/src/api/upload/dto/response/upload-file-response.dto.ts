/**
 * @author jochongs
 */
export class UploadFileResponseDto {
  /**
   * 업로드한 이미지에 접근할 수 있는 Full url
   
   * @example "https://liket-for-dev.s3.ap-northeast-2.amazonaws.com/inquiry/10c2add3-24f2-4681-a455-7771c414d677.png"
   */
  fullUrl: string;

  /**
   * 생성된 파일의 이름
   *
   * @example "10c2add3-24f2-4681-a455-7771c414d677.png"
   */
  fileName: string;

  /**
   * 파일의 확장자
   *
   * @example "png"
   */
  fileExt: string;

  /**
   * 파일의 경로
   *
   * @example "/inquiry/10c2add3-24f2-4681-a455-7771c414d677.png"
   */
  filePath: string;
}
