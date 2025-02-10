import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class HashService {
  /**
   * 비밀번호를 해시하는 메서드
   *
   * @author jochongs
   *
   * @param pw 해싱할 비밀번호
   * @returns 해싱된 문자열
   */
  public async hashPw(pw: string): Promise<string> {
    return await hash(pw, await genSalt(8));
  }

  /**
   * 비밀번호를 비교하는 메서드
   *
   * @param rawPw 해싱되지 않은 비밀번호
   * @param encryptedPw 해싱된 비밀번호
   * @returns 동일한지 비교 (true일 경우 동일)
   */
  public async comparePw(rawPw: string, encryptedPw: string): Promise<boolean> {
    return await compare(rawPw, encryptedPw);
  }
}
