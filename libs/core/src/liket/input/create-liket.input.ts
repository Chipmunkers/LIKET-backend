import { CreateBgImgInfoInput } from 'libs/core/liket/input/create-bg-img-info.input';
import { CreateLiketImgShapeInput } from 'libs/core/liket/input/create-liket-img-shape.input';
import { CreateLiketTextShapeInput } from 'libs/core/liket/input/create-liket-text-shape.input';

/**
 * @author jochongs
 */
export class CreateLiketInput {
  /**
   * 카드 이미지 경로
   */
  public readonly cardImgPath: string;

  /**
   * LIKET 사이즈 형식
   */
  public readonly size: 1 | 2 | 3;

  /**
   * 라이켓 텍스트
   */
  public readonly textShape?: CreateLiketTextShapeInput;

  /**
   * 카드 꾸미기 이미지 목록
   */
  public readonly imgShapes: CreateLiketImgShapeInput[];

  /**
   * 배경 이미지 목록
   */
  public readonly bgImgInfo: CreateBgImgInfoInput;

  /**
   * 리뷰 텍스트
   */
  public readonly description: string;
}
