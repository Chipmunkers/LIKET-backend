import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class HashService {
  async comparePw(pw: string, hashedPw: string): Promise<boolean> {
    return await compare(pw, hashedPw);
  }
}
