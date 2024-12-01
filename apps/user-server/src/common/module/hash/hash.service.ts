import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class HashService {
  /**
   * 비밀번호를 해시하는 메서드.
   * password에만 사용해야하며 다른 해싱이 필요한 경우 내부 논의 필요
   *
   * @author jochongs
   */
  public hashPw(pw: string) {
    return hashSync(pw, genSaltSync(8));
  }

  /**
   * 해시 처리된 비밀번호를 비교하는 메서드.
   *
   * @author jochongs
   */
  public comparePw(inputPw: string, hashedPw: string) {
    return compareSync(inputPw, hashedPw);
  }
}
