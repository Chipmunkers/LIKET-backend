import { BgImgInfoEntity } from 'apps/user-server/src/api/liket/entity/bgImgInfo.entity';
import { ImgShapeEntity } from 'apps/user-server/src/api/liket/entity/imgShape.entity';

/**
 * @author jochongs
 */
export type LiketInput = {
  /**
   * 리뷰 인덱스
   */
  reviewIdx: number;

  /**
   * 배경 이미지 경로
   *
   * @default "랜덤 이미지 경로"
   */
  bgImgPath?: string;

  /**
   * 배경 이미지 정보
   *
   * @default "랜덤 정보 json"
   */
  bgImgInfo?: BgImgInfoEntity;

  /**
   * 카드 이미지 경로
   *
   * @default "랜덤 이미지 경로"
   */
  cardImgPath?: string;

  /**
   * 글자 json
   *
   * @default null
   */
  textShape?: BgImgInfoEntity | null;

  /**
   * 이미지 json 배열
   *
   * @default []
   */
  ImgShapeEntity?: ImgShapeEntity[];

  /**
   * 사이즈
   *
   * @defualt "0 ~ 127 사이 랜덤 사이즈"
   */
  size?: number;

  /**
   * 설명
   *
   * @default "랜덤 문자열"
   */
  description?: string;

  /**
   * 삭제 일
   *
   * @default null
   */
  deletedAt?: Date | null;
};
