import { Injectable } from '@nestjs/common';
import { FindPwDto } from './dto/find-pw.dto';
import { EmailJwtService } from '../email-cert/email-jwt.service';
import { EmailCertType } from '../email-cert/model/email-cert-type';
import { UserRepository } from './user.repository';
import { LoginUser } from '../auth/model/login-user';
import { ResetPwDto } from './dto/reset-pw.dto';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { InvalidCurrentPasswordException } from './exception/InvalidCurrentPasswordException';
import { UserCoreService } from 'libs/core/user/user-core.service';
import { HashService } from 'libs/modules/hash/hash.service';

@Injectable()
export class UserPwService {
  constructor(
    private readonly hashService: HashService,
    private readonly emailJwtService: EmailJwtService,
    private readonly userRepository: UserRepository,
    private readonly userCoreService: UserCoreService,
  ) {}

  /**
   * 비밀번호 찾기
   *
   * @author jochongs
   */
  public async findPw(findPwDto: FindPwDto): Promise<void> {
    const email = await this.emailJwtService.verify(
      findPwDto.emailToken,
      EmailCertType.FIND_PW,
    );

    const user = await this.userCoreService.findUserByEmail(email);

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    await this.updatePw(user.idx, findPwDto.pw);
  }

  /**
   * 사용자 비밀번호 변경하기
   *
   * @author jochongs
   */
  public async resetLoginUserPw(
    loginUser: LoginUser,
    resetDto: ResetPwDto,
  ): Promise<void> {
    const user = await this.userRepository.selectUserByIdx(loginUser.idx);

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    if (!(await this.hashService.comparePw(resetDto.currPw, user.pw || ''))) {
      throw new InvalidCurrentPasswordException('Wrong password');
    }

    await this.updatePw(loginUser.idx, resetDto.resetPw);
  }

  /**
   * 비밀번호 변경하기
   *
   * @author jochongs
   */
  public async updatePw(idx: number, pw: string): Promise<void> {
    await this.userCoreService.updateUserByIdx(idx, { pw });
  }
}
