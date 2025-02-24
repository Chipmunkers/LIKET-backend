import { CoordinateRageInput } from 'libs/core/culture-content/input/coordinate-range.input';
import { Age } from 'libs/core/tag-root/age/constant/age';
import { Genre } from 'libs/core/tag-root/genre/constant/genre';
import { Style } from 'libs/core/tag-root/style/constant/style';

/**
 * @author jochongs
 */
export class FindCultureContentAllInput {
  /**
   * 페이지 (1부터 시작)
   */
  public readonly page: number;

  /**
   * 한 번에 불러올 데이터 개수
   */
  public readonly row: number;

  /**
   * 활성화 컨텐츠 필터링
   *
   * true: 활성화된 컨텐츠만 가져옴
   * false: 비활성화된 컨텐츠만 가져옴
   */
  public readonly accept?: boolean;

  /**
   * 컨텐츠 오픈 상태 필터링
   *
   * soon-open: 오픈 예정인 컨텐츠 필터링
   * continue: 진행중인 컨텐츠 필터링
   * end: 종료된 컨텐츠 필터링
   *
   * @default []
   */
  public readonly open?: ('soon-open' | 'continue' | 'end')[];

  /**
   * 특정 장르만 보는 필터링
   */
  public readonly genreList?: Genre[];

  /**
   * 특정 스타일만 보는 필터링
   */
  public readonly styleList?: Style[];

  /**
   * 특정 연령대만 보는 필터링
   */
  public readonly ageList?: Age[];

  /**
   * 검색 요소
   *
   * title: 제목으로 검색
   * user: 사용자 닉네임, 이메일, idx로 검색
   * id: 컨텐츠 아이디로 검색
   *
   * @default []
   */
  public readonly searchByList?: ('title' | 'user' | 'id')[];

  /**
   * 검색 키워드
   */
  public readonly searchKeyword?: string;

  /**
   * 정렬 요소
   *
   * @default "accept"
   */
  public readonly orderBy?: 'accept' | 'like' | 'create';

  /**
   * 정렬 방식
   *
   * @default "desc"
   */
  public readonly order?: 'asc' | 'desc';

  /**
   * 좌표 범위
   * 해당 좌표 범위 내부 컨텐츠로 필터링
   */
  public readonly coordinateRange?: CoordinateRageInput;

  /**
   * 작성자 인덱스
   */
  public readonly author?: number;

  /**
   * 법정동 앞 두자리 필터링
   */
  public readonly sidoCode?: string;
}
