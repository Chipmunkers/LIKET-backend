import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyLimitExceedException } from '../exception/KeyLimitExceedException';

@Injectable()
export class KopisKeyProvider {
  /**
   * Service key 리스트
   */
  private readonly KOPIS_SERVICE_KEY_LIST: string[];

  /**
   * 쿼리 사용 횟수
   */
  private keyUseCounting = 0;

  /**
   * OPEN API 쿼리 제한 횟수
   *
   * TODO: 매일 매일 초기화하는 로직을 넣어야하는데 까먹었어요.
   */
  private KEY_QUERY_LIMIT = 150000000;

  constructor(private readonly configService: ConfigService) {
    this.KOPIS_SERVICE_KEY_LIST = this.configService.get('kopis').keys || '';
  }

  /**
   * 키를 가져오는 메서드
   *
   * !주의
   * 키 사용에는 1500회 제한이 있습니다.
   *
   * @Link https://www.kopis.or.kr/por/cs/openapi/openApiFaq.do?menuId=MNU_00074#n
   *
   * 키 사용 카운팅이 어떤 시점에 이루어지는지 명시되어있지 않습니다.
   * 따라서 안전한 사용을 위해 우리 서비스에서는 getKey메서드를 사용하는 것으로 카운팅합니다.
   *
   * @author jochongs
   */
  public getKey() {
    const key = this.KOPIS_SERVICE_KEY_LIST[this.getKeyListIndex()];

    this.keyUseCounting++;
    if (!key) {
      throw new KeyLimitExceedException(
        'KEY QUERY Limit Exceed | use = ' + this.keyUseCounting,
      );
    }

    return key;
  }

  /**
   * Key의 인덱스를 가져오는 메서드
   *
   * @author jochongs
   */
  private getKeyListIndex() {
    return Math.floor(this.keyUseCounting / this.KEY_QUERY_LIMIT);
  }
}
