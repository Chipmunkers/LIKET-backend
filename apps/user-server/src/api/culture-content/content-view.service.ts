import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/module/redis/redis.service';
import { CultureContentRepository } from './culture-content.repository';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class ContentViewService {
  /**
   * 조회수 증가 이벤트가 현재 존재하는지 확인하는 변수
   * key값은 컨텐츠 인덱스이며 value는 이벤트의 id이다.
   * value값은 clearTimeout을 위해 사용된다.
   *
   * @author jochongs
   */
  public static EVENT_ID_MAP: Record<number, NodeJS.Timeout> = {};

  /**
   * 조회수 증가가 요청이 된 후 업데이트를 할 때 까지 걸리는 시간 (ms)
   *
   * @author jochongs
   *
   * @example 2 * 1000일 경우 조회수가 2초 뒤에 업데이트 됨
   */
  public static readonly UPDATE_TIME = 2 * 1000;

  /**
   * 조회수 쿨타임. 첫 조회 이후 해당 쿨타임 만큼 시간이 지나지 않으면 조회수 카운트가 이루어지지 않음
   *
   * @author jochongs
   *
   * @example 3 * 60 * 1000
   */
  public static readonly VIEW_COOL_DOWN = 3 * 60 * 1000;

  constructor(
    private readonly redisService: RedisService,
    private readonly cultureContentRepository: CultureContentRepository,
    @Logger(ContentViewService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 컨텐츠 조회수 1 증가 메서드
   *
   * @author jochongs
   *
   * @param userIdx 사용자 인덱스
   * @param contentIdx 컨텐츠 인덱스
   */
  public increaseViewCount(userIdx: number, contentIdx: number) {
    const alreadyReadState = this.checkUserReadContent(userIdx, contentIdx);

    if (alreadyReadState) return;

    const contentViewCount = this.getContentViewCount(contentIdx);

    this.redisService.setSync(
      this.getContentViewCountCacheKey(contentIdx),
      (contentViewCount + 1).toString(),
    );

    this.saveUserReadContentState(userIdx, contentIdx);

    if (!this.isContentUpdateEventWait(contentIdx)) {
      ContentViewService.EVENT_ID_MAP[contentIdx] = setTimeout(async () => {
        try {
          const viewCount = this.getContentViewCount(contentIdx);

          this.redisService.del(this.getContentViewCountCacheKey(contentIdx));

          delete ContentViewService.EVENT_ID_MAP[contentIdx];

          await this.cultureContentRepository.increaseContentViewCountByIdx(
            contentIdx,
            viewCount,
          );
        } catch (err) {
          // TODO: 에러 발생 시, 보상 트랜잭션 확인 필요
          this.logger.error(
            this.increaseViewCount,
            'increase view count event error',
            err,
          );
        }
      }, ContentViewService.UPDATE_TIME);
    }
  }

  /**
   * 컨텐츠 업데이트 이벤트가 대기 상태인지 확인하는 변수
   *
   * @author jochongs
   *
   * @param contentIdx 컨텐츠 인덱스
   */
  private isContentUpdateEventWait(contentIdx: number): boolean {
    return !!ContentViewService.EVENT_ID_MAP[contentIdx];
  }

  /**
   * 캐시 저장소에서 컨텐츠 조회수를 가져오는 메서드.
   * 만약, 저장되어있는 컨텐츠 조회수가 없다면 0을 반환.
   *
   * @author jochongs
   *
   * @param contentIdx 컨텐츠 인덱스
   */
  private getContentViewCount(contentIdx: number): number {
    const contentViewCountString = this.redisService.getSync(
      this.getContentViewCountCacheKey(contentIdx),
    );

    if (!contentViewCountString) return 0;

    return Number(contentViewCountString);
  }

  /**
   * 사용자가 해당 컨텐츠를 조회수 쿨타임 안에 또 봤는지 확인하는 메서드
   *
   * @author jochongs
   *
   * @param userIdx 사용자 인덱스
   * @param contentIdx 컨텐츠 인덱스
   */
  private checkUserReadContent(userIdx: number, contentIdx: number): boolean {
    return !!this.redisService.getSync(
      this.getUserReadStateCacheKey(userIdx, contentIdx),
    );
  }

  /**
   * 사용자가 컨텐츠를 읽었다는 정보를 저장
   *
   * @author jochongs
   *
   * @param userIdx
   * @param contentIdx
   */
  private saveUserReadContentState(userIdx: number, contentIdx: number): void {
    this.redisService.setSync(
      this.getUserReadStateCacheKey(userIdx, contentIdx),
      '1',
      ContentViewService.VIEW_COOL_DOWN,
    );
  }

  /**
   * 키 값을 가져오는 메서드
   *
   * @author jochongs
   *
   * @param userIdx 사용자 인덱스
   * @param contentIdx 컨텐츠 인덱스
   */
  private getUserReadStateCacheKey(userIdx: number, contentIdx: number) {
    return `${RedisService.STORE_PREFIX.CONTENT_VIEW_STATE}-${userIdx}-${contentIdx}`;
  }

  /**
   * 컨텐츠 조회수 전용 캐시 키 반환 메서드
   *
   * @author jochongs
   *
   * @param contentIdx 컨텐츠 인덱스
   */
  private getContentViewCountCacheKey(contentIdx: number) {
    return `${RedisService.STORE_PREFIX.CONTENT_VIEW_COUNT}-${contentIdx}`;
  }
}
