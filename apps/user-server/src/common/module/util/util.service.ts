import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UtilService {
  /**
   * UUID를 생성하는 메서드
   *
   * @author jochongs
   */
  public getUUID(): string {
    return uuidv4();
  }

  /**
   * 숫자로 이루어진 랜덤 문자열을 만들어주는 메서드
   * TODO: 공용적으로 사용하는 이름으로 변경해야함
   *
   * @author jochongs
   */
  public randomVerificationCode(): string {
    const length = 6;

    return Math.floor(Math.random() * 10 ** length)
      .toString()
      .padStart(length, '0');
  }
}
