import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class HashService {
  public hashPw(pw: string) {
    return hashSync(pw, genSaltSync(8));
  }

  public comparePw(inputPw: string, hashedPw: string) {
    return compareSync(inputPw, hashedPw);
  }
}
