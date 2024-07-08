import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { UpdatePwDto } from './dto/update-pw.dto';
import { UserService } from './user.service';
import { HashService } from '../../common/module/hash/hash.service';
import { FindPwDto } from './dto/find-pw.dto';
import { EmailJwtService } from '../email-cert/email-jwt.service';
import { EmailCertType } from '../email-cert/model/email-cert-type';

@Injectable()
export class UserPwService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly emailJwtService: EmailJwtService,
  ) {}

  public async findPw(findPwDto: FindPwDto) {
    const email = await this.emailJwtService.verify(
      findPwDto.emailToken,
      EmailCertType.FIND_PW,
    );

    const user = await this.userService.getUserByEmail(email);

    await this.updatePw(user.idx, findPwDto.pw);

    return;
  }

  public async updatePw(idx: number, pw: string): Promise<void> {
    await this.userService.getUserByIdx(idx);

    await this.prisma.user.update({
      where: {
        idx,
      },
      data: {
        pw: this.hashService.hashPw(pw),
      },
    });

    return;
  }
}
